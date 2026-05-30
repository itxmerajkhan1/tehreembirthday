import React, { useEffect, useRef } from 'react';

export function ParticleCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Sparkle Star Particle Class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      decay: number;
      type: 'twinkle' | 'drift' | 'gold_dust';
      pulseDirection: number;

      constructor(isInitial: boolean = false) {
        this.x = Math.random() * width;
        // If initial, spawn all over. Otherwise, spawn near bottom for drift.
        this.y = isInitial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.5 + 0.8;
        
        const colors = [
          '#f472b6', // soft pink
          '#a855f7', // purple
          '#fbbf24', // golden yellow
          '#ffffff', // crystal white
          '#ec4899', // rich pink
          '#fae8ff'  // velvet fuchsia
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 0.4 - 0.2;
        
        // Custom types for diverse luxury visuals
        const roll = Math.random();
        if (roll < 0.35) {
          this.type = 'twinkle';
          this.speedY = 0; // stationary sparkling star
          this.decay = 0; // doesn't die, just flashes
          this.opacity = Math.random() * 0.7 + 0.2;
          this.pulseDirection = Math.random() > 0.5 ? 0.015 : -0.015;
        } else if (roll < 0.70) {
          this.type = 'drift';
          this.speedY = -(Math.random() * 0.5 + 0.3); // drifting fireflies
          this.decay = Math.random() * 0.003 + 0.001;
          this.opacity = Math.random() * 0.8 + 0.2;
          this.pulseDirection = 0;
        } else {
          this.type = 'gold_dust';
          this.speedY = -(Math.random() * 0.3 + 0.1); // peaceful gold dust
          this.decay = Math.random() * 0.001 + 0.001;
          this.opacity = Math.random() * 0.9 + 0.1;
          this.color = '#fbbf24'; // pure gold
          this.pulseDirection = 0;
        }
      }

      update() {
        if (this.type === 'twinkle') {
          // Twinkle pulse opacity
          this.opacity += this.pulseDirection;
          if (this.opacity >= 0.9 || this.opacity <= 0.1) {
            this.pulseDirection *= -1;
          }
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
          this.opacity -= this.decay;

          // Recycle dying/drifting particles
          if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
            this.x = Math.random() * width;
            this.y = height + 5;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.size = Math.random() * 2.5 + 0.8;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.type === 'twinkle' && this.size > 2) {
          // Draw a luxury star shape plus glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const maxCount = active ? 75 : 20;
    // Pre-populate so background is instantly cozy on launch
    const list = Array.from({ length: maxCount }).map(() => new Particle(true));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      list.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
