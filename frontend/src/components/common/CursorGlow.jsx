import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

/**
 * Serene Neural Constellation & Ambient Fluid Glow (CursorGlow)
 * 
 * Redesigned for a calming, soothing, and unique developer experience:
 * - Completely removes irritating floating text tokens (no "sudo", "git", "const", etc.)
 * - Ethereal Neural Graph: Soft glowing micro-nodes connect with delicate synaptic filaments
 * - Fluid Ambient Light Aura: A serene, silky glow halo tracks the cursor smoothly
 * - Gentle Ripple Pulse: Subtle water-like ring ripples on click instead of loud bursts
 * - 100% non-intrusive (pointer-events: none, low opacity, 60/120fps hardware acceleration)
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

    // Mouse tracking & smooth trailing position (lerp)
    const mouse = {
      x: -300,
      y: -300,
      prevX: -300,
      prevY: -300,
      trailX: -300,
      trailY: -300,
      active: false,
      isHovering: false,
      distanceTraveled: 0
    };

    let animFrameId = null;

    // Theme palette configuration helper
    const getThemeConfig = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'learning';
      if (theme === 'practical') {
        return {
          // Terminal Zone: Ethereal emerald, cyan & mint bioluminescence
          haloColor: 'rgba(16, 245, 160, 0.08)',
          haloBorder: 'rgba(16, 245, 160, 0.25)',
          nodeColors: ['#10f5a0', '#2dd4bf', '#06b6d4', '#34d399', '#6ee7b7'],
          synapseColor: 'rgba(16, 245, 160, ',
          coreDotColor: '#10b981',
          rippleColor: 'rgba(16, 245, 160, '
        };
      }
      return {
        // Study Corner: Soothing sunset coral, amber & lavender aura
        haloColor: 'rgba(240, 106, 85, 0.07)',
        haloBorder: 'rgba(240, 106, 85, 0.2)',
        nodeColors: ['#f06a55', '#fb923c', '#f59e0b', '#a78bfa', '#f472b6'],
        synapseColor: 'rgba(240, 106, 85, ',
        coreDotColor: '#f06a55',
        rippleColor: 'rgba(240, 106, 85, '
      };
    };

    // Resize listener
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Neural Stardust Particles
    const nodes = [];
    const MAX_NODES = 32;

    class NeuralNode {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx * 0.1 + (Math.random() - 0.5) * 0.4;
        this.vy = vy * 0.1 + (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1.2; // delicate micro-dot (1.2px - 2.7px)
        this.life = 1.0;
        this.decay = Math.random() * 0.012 + 0.008; // slow peaceful fade
        
        const config = getThemeConfig();
        this.color = config.nodeColors[Math.floor(Math.random() * config.nodeColors.length)];
      }

      update() {
        this.life -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.97; // smooth fluid damping
        this.vy *= 0.97;
        return this.life > 0;
      }

      draw(context) {
        if (this.life <= 0) return;
        context.save();
        context.globalAlpha = Math.max(0, this.life * 0.7);
        context.shadowColor = this.color;
        context.shadowBlur = 6;
        context.fillStyle = this.color;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    // Peaceful Click Wave Ripples
    const ripples = [];
    class WaveRipple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.maxRadius = 36;
        this.life = 1.0;
        this.decay = 0.025;
      }

      update() {
        this.life -= this.decay;
        this.radius += (this.maxRadius - this.radius) * 0.1;
        return this.life > 0;
      }

      draw(context) {
        if (this.life <= 0) return;
        const config = getThemeConfig();
        context.save();
        context.strokeStyle = `${config.rippleColor}${Math.max(0, this.life * 0.4)})`;
        context.lineWidth = 1.2;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    }

    // Connect close floating micro-nodes with whisper-thin synaptic filaments
    const drawSynapticConnections = (context) => {
      const config = getThemeConfig();
      context.lineWidth = 0.6;

      // Connect nodes to each other
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 55) {
            const alpha = (1 - dist / 55) * Math.min(n1.life, n2.life) * 0.25;
            context.strokeStyle = `${config.synapseColor}${alpha})`;
            context.beginPath();
            context.moveTo(n1.x, n1.y);
            context.lineTo(n2.x, n2.y);
            context.stroke();
          }
        }

        // Also draw soft connection line from nearest nodes to smooth cursor position
        if (mouse.active) {
          const n = nodes[i];
          const distToMouse = Math.hypot(n.x - mouse.trailX, n.y - mouse.trailY);
          if (distToMouse < 45) {
            const alpha = (1 - distToMouse / 45) * n.life * 0.2;
            context.strokeStyle = `${config.synapseColor}${alpha})`;
            context.beginPath();
            context.moveTo(n.x, n.y);
            context.lineTo(mouse.trailX, mouse.trailY);
            context.stroke();
          }
        }
      }
    };

    // Draw peaceful ambient fluid halo & smooth trailing core dot
    const drawAmbientHalo = (context) => {
      if (!mouse.active || mouse.trailX < 0) return;
      const config = getThemeConfig();

      context.save();

      // 1. Soft Ambient Radial Glow Halo (Silky, diffuse light aura)
      const haloRadius = mouse.isHovering ? 28 : 20;
      const gradient = context.createRadialGradient(
        mouse.trailX,
        mouse.trailY,
        0,
        mouse.trailX,
        mouse.trailY,
        haloRadius
      );
      gradient.addColorStop(0, config.haloColor);
      gradient.addColorStop(0.7, config.haloColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(mouse.trailX, mouse.trailY, haloRadius, 0, Math.PI * 2);
      context.fill();

      // 2. Delicate Micro Core Dot at exact pointer position
      context.beginPath();
      context.arc(mouse.x, mouse.y, mouse.isHovering ? 3 : 2, 0, Math.PI * 2);
      context.fillStyle = config.coreDotColor;
      context.shadowColor = config.coreDotColor;
      context.shadowBlur = 4;
      context.fill();

      context.restore();
    };

    // Mouse movement handler
    const handleMouseMove = (e) => {
      mouse.active = true;

      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Initialize trail position immediately if offscreen
      if (mouse.trailX < 0) {
        mouse.trailX = mouse.x;
        mouse.trailY = mouse.y;
      }

      const stepDist = Math.hypot(dx, dy);
      mouse.distanceTraveled += stepDist;

      // Spawn a subtle luminous node every ~28px of movement (gentle spacing, no clutter)
      if (mouse.distanceTraveled > 28) {
        if (nodes.length < MAX_NODES) {
          nodes.push(new NeuralNode(mouse.x, mouse.y, dx, dy));
        }
        mouse.distanceTraveled = 0;
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

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

    // Click: spawn peaceful wave ripple
    const handleMouseDown = (e) => {
      ripples.push(new WaveRipple(e.clientX, e.clientY));
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

    // Animation Render Loop (60/120fps smooth lerp)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth spring trailing physics for the ambient halo
      mouse.trailX += (mouse.x - mouse.trailX) * 0.16;
      mouse.trailY += (mouse.y - mouse.trailY) * 0.16;

      // 1. Draw delicate synaptic connections between nodes
      drawSynapticConnections(ctx);

      // 2. Update & render neural micro-nodes
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.update()) {
          n.draw(ctx);
        } else {
          nodes.splice(i, 1);
        }
      }

      // 3. Update & render click wave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        if (r.update()) {
          r.draw(ctx);
        } else {
          ripples.splice(i, 1);
        }
      }

      // 4. Draw soothing ambient fluid halo & core dot
      drawAmbientHalo(ctx);

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
