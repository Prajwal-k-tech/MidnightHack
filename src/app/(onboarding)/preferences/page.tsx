'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Lock, PlusCircle, XCircle } from 'lucide-react';

// Define generic attributes and their operator types
const attributes = {
  'Credential A': 'categorical',
  'Numerical Value B': 'numerical',
  'Reputation Score': 'numerical',
  'Location Data': 'location',
};

const operatorMap = {
  numerical: ['is greater than', 'is less than', 'is equal to'],
  categorical: ['is verified', 'is not verified'],
  location: ['is within (miles)'],
};

export default function PreferencesPage() {
  const router = useRouter();
  const { rules, addRule, removeRule } = useWalletStore();
  const [currentAttribute, setCurrentAttribute] = useState<string>('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAddRule = () => {
    if (!currentAttribute || !currentOperator || !currentValue) return;
    const newRule = {
      id: Date.now(),
      attribute: currentAttribute,
      operator: currentOperator,
      value: currentValue,
    };
    addRule(newRule);
    // Reset form
    setCurrentAttribute('');
    setCurrentOperator('');
    setCurrentValue('');
  };

  const handleRemoveRule = (id: number) => {
    removeRule(id);
  };

  const availableOperators = attributes[currentAttribute as keyof typeof attributes]
    ? operatorMap[attributes[currentAttribute as keyof typeof attributes] as keyof typeof operatorMap]
    : [];

  return (
    <div className="w-full max-w-2xl text-center">
      <div className="flex items-center justify-center mb-2">
        <Lock className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-4xl font-heading text-foreground">Private Matching Rules</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-8">Create a set of private rules for matching. These are encrypted and never shared.</p>

      <div className="space-y-6 text-left">
        {/* Rule Builder Form */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <Label className="font-semibold">Add New Rule</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
            <Select value={currentAttribute} onValueChange={setCurrentAttribute}>
              <SelectTrigger><SelectValue placeholder="Select Attribute..." /></SelectTrigger>
              <SelectContent>
                {Object.keys(attributes).map(attr => <SelectItem key={attr} value={attr}>{attr}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={currentOperator} onValueChange={setCurrentOperator} disabled={!currentAttribute}>
              <SelectTrigger><SelectValue placeholder="Select Operator..." /></SelectTrigger>
              <SelectContent>
                {availableOperators.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter Value..."
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="md:col-span-2"
            />
          </div>
          <Button size="sm" className="mt-3" onClick={handleAddRule} disabled={!currentAttribute || !currentOperator || !currentValue}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Rule
          </Button>
        </div>

        {/* Rule List */}
        <div className="space-y-2">
          <Label className="font-semibold">Active Rules</Label>
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No rules added yet.</p>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">{rule.attribute}</span>
                  <span className="text-muted-foreground">{rule.operator}</span>
                  <span className="font-semibold text-primary">{rule.value}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveRule(rule.id)}>
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-between w-full">
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
        <Button size="lg" onClick={() => router.push('/complete')}>Save & Finish</Button>
      </div>
    </div>
  );
};