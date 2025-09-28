#!/usr/bin/env node

/**
 * CLI tool for Private Dating Platform - Midnight dApp
 * Based on the kyc-midnight project pattern
 * 
 * This tool manages:
 * - Contract compilation
 * - Local testnet deployment
 * - User registration and matching
 * - Docker environment management
 */

import { Command } from 'commander';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { spawn, spawnSync } from 'child_process';

const program = new Command();

// Constants
const CONTRACT_DIR = join(process.cwd(), 'contract');
const BUILD_DIR = join(CONTRACT_DIR, 'build');
const DOCKER_COMPOSE_FILE = join(CONTRACT_DIR, 'docker-compose.yml');

// Utility functions
function runCommand(command: string, args: string[], options = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { 
    stdio: 'inherit', 
    cwd: CONTRACT_DIR,
    ...options 
  });
  
  if (result.error) {
    console.error(`Error running command: ${result.error.message}`);
    process.exit(1);
  }
  
  if (result.status !== 0) {
    console.error(`Command failed with exit code ${result.status}`);
    process.exit(1);
  }
  
  return result;
}

function runCommandAsync(command: string, args: string[], options = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  return spawn(command, args, { 
    stdio: 'inherit', 
    cwd: CONTRACT_DIR,
    ...options 
  });
}

// Setup command - initialize the development environment
program
  .command('setup')
  .description('Initialize the development environment')
  .action(() => {
    console.log('🚀 Setting up Private Dating Platform development environment...');
    
    // Create necessary directories
    if (!existsSync(BUILD_DIR)) {
      mkdirSync(BUILD_DIR, { recursive: true });
      console.log('✅ Created build directory');
    }
    
    // Install dependencies
    console.log('📦 Installing Node.js dependencies...');
    runCommand('npm', ['install']);
    
    console.log('✅ Setup complete! Run `./cli.ts start` to begin development.');
  });

// Compile command - compile the Compact contract
program
  .command('compile')
  .description('Compile the Compact smart contract')
  .action(() => {
    console.log('🔨 Compiling PrivateDatingPlatform.compact...');
    
    // Check if compact compiler is available
    try {
      runCommand('compact', ['--version']);
    } catch (error) {
      console.error('❌ Compact compiler not found. Please install the Midnight SDK.');
      process.exit(1);
    }
    
    // Compile the contract
    runCommand('compact', [
      'build',
      'src/PrivateDatingPlatform.compact',
      '--output-dir',
      'build',
      '--witnesses',
      'src/witnesses.ts'
    ]);
    
    console.log('✅ Contract compiled successfully!');
  });

// Start command - start the local development environment
program
  .command('start')
  .description('Start the local Midnight development environment')
  .action(() => {
    console.log('🌙 Starting Midnight development environment...');
    
    // Check if Docker is running
    try {
      runCommand('docker', ['--version']);
      runCommand('docker-compose', ['--version']);
    } catch (error) {
      console.error('❌ Docker or Docker Compose not found. Please install Docker.');
      process.exit(1);
    }
    
    // Start the environment using Docker Compose
    console.log('🐳 Starting Docker containers...');
    const dockerProcess = runCommandAsync('docker-compose', ['up', '--build']);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\\n🛑 Shutting down development environment...');
      runCommand('docker-compose', ['down']);
      process.exit(0);
    });
    
    dockerProcess.on('exit', (code) => {
      console.log(`Docker environment exited with code ${code}`);
    });
  });

// Stop command - stop the local development environment
program
  .command('stop')
  .description('Stop the local Midnight development environment')
  .action(() => {
    console.log('🛑 Stopping Midnight development environment...');
    runCommand('docker-compose', ['down']);
    console.log('✅ Environment stopped.');
  });

// Deploy command - deploy the contract to local testnet
program
  .command('deploy')
  .description('Deploy the contract to the local testnet')
  .action(() => {
    console.log('🚀 Deploying PrivateDatingPlatform contract...');
    
    // First, compile if needed
    if (!existsSync(join(BUILD_DIR, 'PrivateDatingPlatform'))) {
      console.log('📦 Contract not found, compiling first...');
      runCommand('compact', [
        'build',
        'src/PrivateDatingPlatform.compact',
        '--output-dir',
        'build',
        '--witnesses',
        'src/witnesses.ts'
      ]);
    }
    
    // Deploy using the generated deployment script
    console.log('📤 Deploying to local testnet...');
    runCommand('node', ['build/deploy.js']);
    
    console.log('✅ Contract deployed successfully!');
  });

// Test commands for the dating platform functionality
program
  .command('register')
  .description('Register a test user profile')
  .option('--age <age>', 'User age', '25')
  .option('--location <location>', 'User location', 'New York')
  .option('--bio <bio>', 'User bio', 'Looking for my ZK soulmate!')
  .action((options) => {
    console.log('👤 Registering test user...');
    console.log(`Age: ${options.age}, Location: ${options.location}`);
    console.log(`Bio: ${options.bio}`);
    
    // This would call the register circuit
    runCommand('node', [
      'build/test-scripts/register.js',
      '--age', options.age,
      '--location', options.location,
      '--bio', options.bio
    ]);
  });

program
  .command('match')
  .description('Request a match with another user')
  .requiredOption('--target <address>', 'Target user address')
  .action((options) => {
    console.log(`💕 Requesting match with ${options.target}...`);
    
    // This would call the requestMatch circuit
    runCommand('node', [
      'build/test-scripts/match.js',
      '--target', options.target
    ]);
  });

program
  .command('approve')
  .description('Approve a match request')
  .requiredOption('--requester <address>', 'Requester user address')
  .action((options) => {
    console.log(`✅ Approving match request from ${options.requester}...`);
    
    // This would call the approveMatch circuit
    runCommand('node', [
      'build/test-scripts/approve.js',
      '--requester', options.requester
    ]);
  });

// Status command - check the status of the development environment
program
  .command('status')
  .description('Check the status of the development environment')
  .action(() => {
    console.log('📊 Checking development environment status...');
    
    // Check Docker containers
    runCommand('docker-compose', ['ps']);
    
    // Check if contract is compiled
    if (existsSync(join(BUILD_DIR, 'PrivateDatingPlatform'))) {
      console.log('✅ Contract is compiled');
    } else {
      console.log('❌ Contract is not compiled');
    }
  });

// Logs command - show logs from the development environment
program
  .command('logs')
  .description('Show logs from the development environment')
  .option('--service <service>', 'Show logs for specific service')
  .action((options) => {
    const args = ['logs', '--follow'];
    if (options.service) {
      args.push(options.service);
    }
    runCommand('docker-compose', args);
  });

// Parse command line arguments
program
  .name('cli')
  .description('CLI tool for Private Dating Platform - Midnight dApp')
  .version('1.0.0');

program.parse(process.argv);