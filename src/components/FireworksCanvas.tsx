import React, { useEffect, useRef, useState } from 'react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

const CELEBRATION_COLORS = [
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#f59e0b', // Gold
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#ffffff'  // Crystal White
];

export function FireworksCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    let animationId: number;

    const rockets: Rocket[] = [];
    const particles: FireworkParticle[] = [];

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    const launchRocket = () => {
      if (rockets.length > 5) return; // Keep performance clean
      const startX = Math.random() * (width - 160) + 80;
      const startY = height;
      const targetY = Math.random() * (height * 0.45) + 50;
      const speed = 4 + Math.random() * 4;
      
      const angle = -Math.PI / 2 + (Math.random() * 0.2 - 0.1); // subtle variation
      
      rockets.push({
        x: startX,
        y: startY,
        targetY: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        size: 2.5 + Math.random() * 1.5,
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const pCount = 60 + Math.random() * 40;
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1 + Math.random() * 5.5;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          color: color,
          size: 1 + Math.random() * 1.8,
          decay: 0.012 + Math.random() * 0.015,
          gravity: 0.06 + Math.random() * 0.04,
          trail: [],
        });
      }
    };

    let lastLaunch = 0;

    const tick = (now: number) => {
      // Create a fading tail effect
      ctx.fillStyle = 'rgba(10, 10, 11, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Periodically trigger launches
      if (now - lastLaunch > 1200 + Math.random() * 1500) {
        launchRocket();
        lastLaunch = now;
      }

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Draw rocket tail trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Explode checking
        if (r.y <= r.targetY || r.y < 30) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw trail logic
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let k = 1; k < p.trail.length; k++) {
            ctx.lineTo(p.trail[k].x, p.trail[k].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.globalAlpha = p.alpha;
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    // Pre-fire standard launches to have instant satisfaction
    setTimeout(() => {
      if (active) {
        launchRocket();
        launchRocket();
      }
    }, 200);

    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
    />
  );
}
