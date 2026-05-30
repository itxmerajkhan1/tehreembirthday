import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Piece {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  scale: number;
  rotation: number;
  xVel: number;
  yVel: number;
}

const CONFETTI_COLORS = [
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#f59e0b', // Gold
  '#10b981', // Emerald/Green
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#f43f5e'  // Rose
];

export function ConfettiEffect({ active, triggerBurst }: { active: boolean, triggerBurst: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // Standard persistent rain confetti plus initial interactive explosion
    const generatePieces = (count: number, isExplosion: boolean) => {
      return Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = isExplosion ? (5 + Math.random() * 15) : (1 + Math.random() * 3);
        return {
          id: i + (isExplosion ? 1000 : 0) + Date.now(),
          x: isExplosion ? 50 : Math.random() * 100, // percentage
          y: isExplosion ? 50 : -10, // vertical start
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          shape: (['circle', 'square', 'triangle'] as const)[i % 3],
          scale: 0.4 + Math.random() * 0.8,
          rotation: Math.random() * 360,
          xVel: isExplosion ? Math.cos(angle) * velocity : (Math.random() * 2 - 1),
          yVel: isExplosion ? Math.sin(angle) * velocity - 2 : (2 + Math.random() * 4), // downwards velocity
        };
      });
    };

    // Burst initial load
    if (triggerBurst) {
      setPieces((prev) => [...prev, ...generatePieces(110, true)]);
    }

    // Periodically spawn peaceful raindrops
    const interval = setInterval(() => {
      setPieces((prev) => {
        // Keep pieces array size reasonable for optimal speed
        const filtered = prev.filter(p => p.y < 110 && p.x > -10 && p.x < 110);
        return [...filtered, ...generatePieces(3, false)];
      });
    }, 450);

    return () => clearInterval(interval);
  }, [active, triggerBurst]);

  // Keep rendering physics cycles using simple Framer motion or ticks
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      <AnimatePresence>
        {pieces.map((piece) => {
          const isExplode = piece.id >= 1000;
          return (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: isExplode ? `${piece.y}vh` : '-5vh',
                scale: piece.scale,
                rotate: piece.rotation,
                opacity: 1
              }}
              animate={{
                x: isExplode 
                  ? [`${piece.x}vw`, `${piece.x + piece.xVel * 3}vw`, `${piece.x + piece.xVel * 6}vw`]
                  : [`${piece.x}vw`, `${piece.x + piece.xVel * 8}vw`],
                y: isExplode
                  ? [`50vh`, `${50 + piece.yVel * 2.5}vh`, '110vh']
                  : '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.8, 0]
              }}
              transition={{
                duration: isExplode ? 2 + Math.random() * 1.5 : 4 + Math.random() * 3,
                ease: isExplode ? 'easeOut' : 'linear',
              }}
              className="absolute pointer-events-none"
              style={{
                width: 12,
                height: 12,
                backgroundColor: piece.color,
                borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'triangle' ? '0%' : '2px',
                clipPath: piece.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
