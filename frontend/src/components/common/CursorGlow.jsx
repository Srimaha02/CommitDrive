import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

/**
 * TechFlyingCursor (CursorGlow)
 * Unique developer-themed floating animation:
 * - As the mouse moves, floating code symbols, git glyphs, and binary sparks fly and drift in the air
 * - Interactive click "Code Burst" shockwave with spinning tech tokens
 * - Dynamic theme adaptation: Cyberpunk Matrix emerald/cyan in Terminal Zone, Syntax Highlight neon in Study Corner
 * - Hardware accelerated Canvas at 60/120fps with zero click interference (pointer-events: none)
 */
export default function CursorGlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only run on devices with a mouse/pointer and without reduced motion
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking state
    const mouse = {
      x: -200,
      y: -200,
      prevX: -200,
      prevY: -200,
      vx: 0,
      vy: 0,
      active: false,
      isHovering: false,
      distanceTraveled: 0
    };

    let idleTimer = null;
    let animFrameId = null;

    // Tech symbols pool
    const terminalSymbols = ['$', 'sudo', 'git', '01', '0x', 'sh', '&&', 'λ', '::', '!=', '200', '>>', 'grep', 'rm -rf'];
    const studySymbols = ['</>', '{ }', 'const', '=>', '01', '&&', '[]', '++', '==', 'λ', 'git', '200', 'async', 'npm'];
    const circuitGlyphs = ['✦', '◆', '•', '■'];

    // Theme palette helper
    const getThemeConfig = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'learning';
      if (theme === 'practical') {
        return {
          symbols: terminalSymbols,
          font: 'bold 12px "JetBrains Mono", "Fira Code", monospace',
          colors: [
            '#10f5a0', // Neon Mint
            '#00ff88', // Matrix Green
            '#00e5ff', // Laser Cyan
            '#39ff14', // Electric Green
            '#93faa5', // Pale Emerald Spark
            '#6ee7b7'  // Soft Teal
          ],
          glowColor: '#10f5a0',
          coreColor: '#10b981'
        };
      }
      return {
        symbols: studySymbols,
        font: 'bold 12px "Inter", "Fira Code", monospace',
        colors: [
          '#e05a3a', // Coral
          '#f59e0b', // Amber Gold
          '#8b5cf6', // Electric Violet
          '#ec4899', // Hot Pink
          '#06b6d4', // Bright Cyan
          '#3b82f6'  // Royal Blue
        ],
        glowColor: '#e05a3a',
        coreColor: '#e05a3a'
      };
    };

    // Resize listener
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle classes
    const particles = [];
    const MAX_PARTICLES = 48;

    class TechParticle {
      constructor(x, y, vx, vy, isBurst = false) {
        this.x = x;
        this.y = y;
        
        // Flight dynamics: directional float with subtle buoyancy
        const speed = Math.hypot(vx, vy);
        const config = getThemeConfig();
        
        this.isGlyph = Math.random() > 0.35 || isBurst;
        this.symbol = this.isGlyph 
          ? config.symbols[Math.floor(Math.random() * config.symbols.length)]
          : circuitGlyphs[Math.floor(Math.random() * circuitGlyphs.length)];

        // Velocity & drift
        if (isBurst) {
          const angle = Math.random() * Math.PI * 2;
          const burstSpeed = Math.random() * 4.5 + 2;
          this.vx = Math.cos(angle) * burstSpeed;
          this.vy = Math.sin(angle) * burstSpeed - 0.8;
        } else {
          this.vx = vx * 0.18 + (Math.random() - 0.5) * 1.8;
          this.vy = vy * 0.18 - Math.random() * 1.5 - 0.6; // gentle upward float
        }

        this.rotation = (Math.random() - 0.5) * 0.4;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        this.scale = isBurst ? Math.random() * 0.5 + 0.9 : Math.random() * 0.4 + 0.8;
        this.life = 1.0;
        this.decay = isBurst ? Math.random() * 0.025 + 0.02 : Math.random() * 0.02 + 0.015;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.glow = config.glowColor;
      }

      update() {
        this.life -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.vx *= 0.96; // air resistance
        this.vy *= 0.96;
        this.vy -= 0.04; // subtle floating buoyancy

        return this.life > 0;
      }

      draw(context) {
        if (this.life <= 0) return;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.scale, this.scale);

        context.globalAlpha = Math.max(0, this.life);
        context.shadowColor = this.color;
        context.shadowBlur = 8;
        context.fillStyle = this.color;

        if (this.isGlyph) {
          context.font = getThemeConfig().font;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(this.symbol, 0, 0);
        } else {
          // Micro circuit spark
          context.beginPath();
          context.arc(0, 0, 2.5, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    // Connect close floating tech particles with subtle circuit lines
    const drawCircuitConnections = (context) => {
      const config = getThemeConfig();
      context.lineWidth = 0.8;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 48) {
            const alpha = (1 - dist / 48) * Math.min(p1.life, p2.life) * 0.35;
            context.strokeStyle = p1.color;
            context.globalAlpha = alpha;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 1;
    };

    // Draw futuristic cyber crosshair & core dot at mouse position
    let reticleAngle = 0;
    const drawPrecisionPointer = (context) => {
      if (!mouse.active || mouse.x < 0) return;
      const config = getThemeConfig();
      reticleAngle += mouse.isHovering ? 0.08 : 0.03;

      context.save();
      context.translate(mouse.x, mouse.y);

      // 1. Center Core Dot
      context.beginPath();
      context.arc(0, 0, mouse.isHovering ? 4 : 3, 0, Math.PI * 2);
      context.fillStyle = config.coreColor;
      context.shadowColor = config.coreColor;
      context.shadowBlur = 6;
      context.fill();

      // 2. Rotating Cyber Reticle
      context.rotate(reticleAngle);
      const ringRadius = mouse.isHovering ? 14 : 10;
      context.strokeStyle = config.coreColor;
      context.lineWidth = 1.2;
      context.shadowBlur = 4;

      // 4 Precision Corner Crosshairs
      const cornerLen = 4;
      for (let i = 0; i < 4; i++) {
        context.rotate(Math.PI / 2);
        context.beginPath();
        context.arc(0, 0, ringRadius, 0, Math.PI / 5);
        context.stroke();
      }

      context.restore();
    };

    // Mouse movement handler
    const handleMouseMove = (e) => {
      mouse.active = true;
      
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.vx = dx;
      mouse.vy = dy;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const stepDist = Math.hypot(dx, dy);
      mouse.distanceTraveled += stepDist;

      // Spawn floating tech glyph every ~18px of mouse movement
      if (mouse.distanceTraveled > 18) {
        if (particles.length < MAX_PARTICLES) {
          particles.push(new TechParticle(mouse.x, mouse.y, mouse.vx, mouse.vy));
        }
        mouse.distanceTraveled = 0;
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      // Check hovering over interactive buttons / cards
      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest(
          'button, a, input, select, textarea, [role="button"], .clickable, .interactive, .subject-tab-btn, .module-tab-btn, .topic-list-item, .mission-item-btn, .gate-card, .podium-card, .table-row, .active-mood-badge'
        )
      ) {
        mouse.isHovering = true;
      } else {
        mouse.isHovering = false;
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouse.vx = 0;
        mouse.vy = 0;
      }, 80);
    };

    // Click "Code Burst" shockwave
    const handleMouseDown = (e) => {
      const burstTokens = 9;
      for (let i = 0; i < burstTokens; i++) {
        particles.push(new TechParticle(e.clientX, e.clientY, 0, 0, true));
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.isHovering = false;
    };

    const handleMouseEnter = () => {
      mouse.active = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw circuit lines between close flying tokens
      drawCircuitConnections(ctx);

      // Update & render flying tech particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const isAlive = p.update();
        if (isAlive) {
          p.draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }

      // Draw precision cyber pointer & reticle
      drawPrecisionPointer(ctx);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="tech-cursor-canvas" 
      aria-hidden="true" 
    />
  );
}
