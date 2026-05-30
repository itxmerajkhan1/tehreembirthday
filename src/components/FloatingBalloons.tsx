import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Balloon {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  popped: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
}

const BALLOON_COLORS = [
  'rgba(244, 63, 94, 0.75)',  // Rose/Pink
  'rgba(168, 85, 247, 0.75)', // Purple
  'rgba(217, 70, 239, 0.75)', // Fuchsia
  'rgba(251, 191, 36, 0.75)', // Gold
  'rgba(59, 130, 246, 0.75)',  // Soft Blue
  'rgba(236, 72, 153, 0.75)'   // Hot Pink
];

export function FloatingBalloons({ active }: { active: boolean }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [burstSparkles, setBurstSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!active) {
      setBalloons([]);
      return;
    }

    // Spawn 22 premium, multi-size floating balloons with varied delays
    const list: Balloon[] = Array.from({ length: 22 }).map((_, i) => {
      // 3 classes of sizes: Small (35-45px), Medium (50-65px), Large (75-95px)
      const sizeClasses = [
        35 + Math.random() * 10,
        50 + Math.random() * 15,
        75 + Math.random() * 20
      ];
      const size = sizeClasses[i % 3];
      
      return {
        id: i + Date.now(),
        x: 5 + Math.random() * 90, // Position horizontally (vw)
        size,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        delay: Math.random() * 9, // staggered entry
        duration: 9 + Math.random() * 9, // different speeds
        popped: false
      };
    });
    setBalloons(list);
  }, [active]);

  // Handle a balloon pop upon visitor click high-satisfaction sound and visual sparkles!
  const handlePop = (e: React.MouseEvent, balloon: Balloon) => {
    e.stopPropagation();
    
    // Trigger sound synthesized burst
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // High pitched pop beep decaying quickly
        osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);
        
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.13);
      }
    } catch (err) {}

    // Find coordinate
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Create burst particles
    const newSparkles = Array.from({ length: 14 }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      return {
        id: idx + Date.now(),
        x: clickX,
        y: clickY,
        color: balloon.color,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    });

    setBurstSparkles(prev => [...prev, ...newSparkles]);
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));

    // Clear old sparkles after 1 second
    setTimeout(() => {
      setBurstSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      
      {/* Balloon Burst Sparkle Sparks */}
      <AnimatePresence>
        {burstSparkles.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ x: spark.x, y: spark.y, scale: 1, opacity: 1 }}
            animate={{ 
              x: spark.x + spark.vx * 15,
              y: spark.y + spark.vy * 15 + 8, // add gravity
              scale: 0.2,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: spark.color }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {active && balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ y: '110vh', x: `${balloon.x}vw`, rotate: 0, opacity: 0 }}
            animate={{
              y: '-25vh',
              x: [
                `${balloon.x}vw`,
                `${balloon.x + 4 * Math.sin(balloon.id)}vw`,
                `${balloon.x - 4 * Math.cos(balloon.id)}vw`,
                `${balloon.x + 3 * Math.sin(balloon.id * 1.5)}vw`
              ],
              rotate: [-5, 5, -5, 5],
              opacity: [0, 0.9, 0.9, 0]
            }}
            transition={{
              duration: balloon.duration,
              delay: balloon.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute rounded-t-full flex flex-col items-center cursor-pointer pointer-events-auto"
            style={{
              width: balloon.size,
              height: balloon.size * 1.25,
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, ${balloon.color} 75%)`,
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => handlePop(e, balloon)}
          >
            {/* Glossy reflection bubble curve */}
            <div className="absolute top-2 left-3 w-1/4 h-1/4 bg-white/45 rounded-full filter blur-[0.5px]" />

            {/* Balloon knot */}
            <div 
              className="absolute bottom-0" 
              style={{
                width: 7,
                height: 7,
                background: balloon.color,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'translateY(100%)',
                filter: 'brightness(0.95)'
              }}
            />
            {/* Balloon string sway */}
            <svg 
              className="absolute bottom-0 text-white/30 fill-none" 
              style={{
                width: 20,
                height: 55,
                transform: 'translateY(110%) translateX(2px)'
              }}
              viewBox="0 0 20 100"
            >
              <path d="M10,0 Q18,25 2,50 T18,100" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
