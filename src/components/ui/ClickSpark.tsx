'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPARK_COLORS = ['#eb9ced', '#ff9df0', '#ca9ae4'];
const SPARK_SIZE = 6;
const SPARK_COUNT = 8;

const generateSpark = (x: number, y: number) => {
  const angleDelta = 360 / SPARK_COUNT;
  return Array.from({ length: SPARK_COUNT }).map((_, i) => ({
    id: `spark-${i}`,
    angle: i * angleDelta,
    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
  }));
};

const HeartSpark = ({ angle, color }: { angle: number; color: string; }) => {
  return (
    <motion.div
      style={{ width: SPARK_SIZE, height: SPARK_SIZE }}
      initial={{
        transform: `rotate(${angle}deg) translateX(0px) scale(1)`,
        opacity: 1,
      }}
      animate={{
        transform: `rotate(${angle}deg) translateX(45px) scale(0)`,
        opacity: 0,
      }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <svg
        width={SPARK_SIZE}
        height={SPARK_SIZE}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

export const ClickSpark = () => {
  const [sparks, setSparks] = useState<any[]>([]);

  const handleMouseClick = useCallback((e: MouseEvent) => {
    const newSparks = generateSpark(e.clientX, e.clientY);
    const now = Date.now();
    setSparks(prevSparks => [...prevSparks, { id: now, x: e.clientX, y: e.clientY, sparks: newSparks }]);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [handleMouseClick]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparks(prevSparks => prevSparks.filter(spark => Date.now() - spark.id < 800));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {sparks.map(({ id, x, y, sparks: sparkList }) => (
        <div
          key={id}
          className="pointer-events-none fixed top-0 left-0"
          style={{ transform: `translateX(${x - SPARK_SIZE / 2}px) translateY(${y - SPARK_SIZE / 2}px)` }}
        >
          {sparkList.map((spark: any) => (
            <HeartSpark key={spark.id} {...spark} />
          ))}
        </div>
      ))}
    </AnimatePresence>
  );
};