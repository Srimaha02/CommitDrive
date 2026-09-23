import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

/**
 * Dark Cyber Ribbon & Precision Nexus Trail (CursorGlow)
 * 
 * Exclusively localized to mouse movements:
 * - NO full-page webs or floating background clutter. The page is 100% clean when idle.
 * - Smooth Dark Cyber Ribbon: As the cursor moves, a sleek, tapered dark ribbon follows the mouse path.
 * - Precision Cyber Nexus: A sharp dark-tech ring with corner ticks and a glowing core dot.
 * - Dark Color Palette: Deep obsidian, charcoal slate, dark emerald & midnight indigo.
 * - Smooth quadratic Bézier smoothing at 60/120fps with zero click interference (pointer-events: none).
 */
export default function CursorGlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and state
    const mouse = {
      x: -500,
      y: -500,
      prevX: -500,
      prevY: -500,
      active: false,
      isHovering: false,
      speed: 0
    };

    // Smooth history points for the dark cyber ribbon trail
    let trail = [];
    const MAX_TRAIL_LENGTH = 28;

    // Localized micro tech-nodes (spawn ONLY along the mouse movement path)
    const sparks = [];
    const MAX_SPARKS = 16;

    let animFrameId = null;

    // Theme color palette (Dark, sleek, tech-focused)
    const getThemeConfig = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'learning';
      if (theme === 'practical') {
        return {
          // Terminal Zone: Deep Obsidian, Dark Emerald & Neon Matrix outline
          ribbonBase: 'rgba(9, 16, 12, ',       // Deep dark charcoal
          ribbonHighlight: 'rgba(6, 78, 59, ',  // Dark forest emerald
          ribbonEdge: 'rgba(16, 185, 129, ',    // Crisp emerald edge
          nexusRing: '#064e3b',
          nexusEdge: '#10b981',
          nexusDot: '#34d399',
          sparkColor: '#10b981'
        };
      }
      return {
        // Study Corner: Deep Midnight Navy, Dark Indigo & Coral edge
        ribbonBase: 'rgba(11, 15, 25, ',        // Deep midnight slate
        ribbonHighlight: 'rgba(30, 27, 75, ',  // Dark indigo
        ribbonEdge: 'rgba(99, 102, 241, ',     // Crisp indigo edge
        nexusRing: '#1e1b4b',
        nexusEdge: '#6366f1',
        nexusDot: '#f06a55',
        sparkColor: '#818cf8'
      };
    };

    // Resize listener
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Spark class for tiny localized trailing vertices
    class MicroSpark {
      constructor(x, y, vx, vy) {
        this.x = x + (Math.random() - 0.5) * 6;
        this.y = y + (Math.random() - 0.5) * 6;
        this.vx = vx * 0.15 + (Math.random() - 0.5) * 0.8;
        this.vy = vy * 0.15 + (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1.2;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.04;
      }

      update() {
        this.life -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        return this.life > 0;
      }

      draw(context, color) {
        if (this.life <= 0) return;
        context.save();
        context.fillStyle = color;
        context.globalAlpha = Math.max(0, this.life * 0.8);
        context.shadowColor = color;
        context.shadowBlur = 4;
        // Draw tiny tech diamond
        context.beginPath();
        context.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        context.fill();
        context.restore();
      }
    }

    // Mouse movement
    const handleMouseMove = (e) => {
      mouse.active = true;
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.speed = Math.hypot(dx, dy);

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Add to trail history
      trail.unshift({
        x: mouse.x,
        y: mouse.y,
        age: 0
      });

      // Keep trail capped
      if (trail.length > MAX_TRAIL_LENGTH) {
        trail.pop();
      }

      // Spawn localized sparks ONLY when actively moving fast enough
      if (mouse.speed > 5 && sparks.length < MAX_SPARKS) {
        sparks.push(new MicroSpark(mouse.x, mouse.y, -dx, -dy));
      }

      // Check hovering over interactive buttons / links
      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest(
          'button, a, input, select, textarea, [role="button"], .clickable, .interactive, .subject-tab-btn, .module-tab-btn, .topic-list-item, .mission-item-btn'
        )
      ) {
        mouse.isHovering = true;
      } else {
        mouse.isHovering = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.isHovering = false;
      mouse.x = -500;
      mouse.y = -500;
      trail = [];
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Draw the Smooth Dark Cyber Ribbon Trail
    const drawDarkRibbonTrail = (context) => {
      if (trail.length < 2) return;
      const config = getThemeConfig();

      // Age points and remove dead points
      for (let i = 0; i < trail.length; i++) {
        trail[i].age += 1;
      }
      trail = trail.filter((p) => p.age < MAX_TRAIL_LENGTH);
      if (trail.length < 2) return;

      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';

      // 1. Dark Shadow / Body Stroke (Tapered)
      for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i + 1];

        const progress = 1 - i / trail.length; // 1 at cursor, 0 at tail
        const lineWidth = Math.max(1, progress * 8);
        const alpha = Math.max(0, progress * 0.7);

        // Core Dark Cyber Body
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = `${config.ribbonBase}${alpha})`;
        context.lineWidth = lineWidth + 3;
        context.stroke();

        // Inner Tech Accent
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = `${config.ribbonHighlight}${alpha * 0.9})`;
        context.lineWidth = lineWidth;
        context.stroke();

        // Outer Crisp Edge Line
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.strokeStyle = `${config.ribbonEdge}${alpha * 0.6})`;
        context.lineWidth = Math.max(0.6, progress * 1.5);
        context.stroke();
      }

      context.restore();
    };

    // Draw Sleek Precision Tech Nexus (Cursor Head)
    let ringPulse = 0;
    const drawPrecisionNexus = (context) => {
      if (!mouse.active || mouse.x < 0) return;
      const config = getThemeConfig();
      ringPulse += 0.04;

      context.save();
      context.translate(mouse.x, mouse.y);

      const targetRadius = mouse.isHovering ? 15 : 11;
      const currentRadius = targetRadius + Math.sin(ringPulse) * 0.8;

      // 1. Outer Dark Geometric Tech Ring
      context.beginPath();
      context.arc(0, 0, currentRadius, 0, Math.PI * 2);
      context.strokeStyle = config.nexusRing;
      context.lineWidth = 2.5;
      context.stroke();

      // 2. High-Tech Edge Accent Ring
      context.beginPath();
      context.arc(0, 0, currentRadius, 0, Math.PI * 2);
      context.strokeStyle = config.nexusEdge;
      context.lineWidth = 1;
      context.stroke();

      // 3. 4 Precision Reticle Ticks
      context.strokeStyle = config.nexusEdge;
      context.lineWidth = 1.2;
      const tickOffset = currentRadius + 2;
      const tickLength = 3.5;

      // Top, Bottom, Left, Right Ticks
      context.beginPath();
      // Top
      context.moveTo(0, -tickOffset);
      context.lineTo(0, -tickOffset - tickLength);
      // Bottom
      context.moveTo(0, tickOffset);
      context.lineTo(0, tickOffset + tickLength);
      // Left
      context.moveTo(-tickOffset, 0);
      context.lineTo(-tickOffset - tickLength, 0);
      // Right
      context.moveTo(tickOffset, 0);
      context.lineTo(tickOffset + tickLength, 0);
      context.stroke();

      // 4. Center Tech Core Dot
      context.beginPath();
      context.arc(0, 0, 2.2, 0, Math.PI * 2);
      context.fillStyle = config.nexusDot;
      context.shadowColor = config.nexusDot;
      context.shadowBlur = 6;
      context.fill();

      context.restore();
    };

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const config = getThemeConfig();

      // 1. Draw Dark Cyber Ribbon Trail (Only where mouse moved)
      drawDarkRibbonTrail(ctx);

      // 2. Update and draw localized trailing micro-sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        if (s.update()) {
          s.draw(ctx, config.sparkColor);
        } else {
          sparks.splice(i, 1);
        }
      }

      // 3. Draw Precision Tech Nexus at cursor
      drawPrecisionNexus(ctx);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId) cancelAnimationFrame(animFrameId);
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
