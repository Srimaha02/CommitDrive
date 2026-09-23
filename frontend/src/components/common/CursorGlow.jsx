import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

/**
 * Interactive Cyber-Spider Web (Plexus Neural Network)
 * 
 * Trending geometric constellation / spider-web effect:
 * - Ambient tech nodes drift gracefully across the screen
 * - When mouse moves, the cursor acts as a gravitational nexus:
 *   crisp glowing spider-web filaments dynamically shoot & connect from the cursor to all nearby nodes
 * - Nodes interconnect with each other to form geometric polygons and web triangles
 * - Elastic spider-web physics: particles near the mouse are magnetically pulled and bounce back
 * - Click triggers a cyber-web ripple pulse that propels the network outward
 * - Dual-theme support:
 *   - Practical Path: Cyber Matrix Emerald & Neon Cyan (#00ff88, #00e5ff)
 *   - Learning Path / Dashboard: Sunset Coral & Electric Indigo (#f06a55, #8b5cf6, #38bdf8)
 * - 100% click-through (pointer-events: none, high-performance 60/120fps hardware canvas)
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

    // Mouse tracking & nexus state
    const mouse = {
      x: -500,
      y: -500,
      radius: 175, // connection radius of the spider-web
      active: false,
      isHovering: false
    };

    let animFrameId = null;

    // Theme configuration
    const getThemeConfig = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'learning';
      if (theme === 'practical') {
        return {
          // Terminal Zone: Matrix Laser Emerald & Cyber Cyan
          nodeColor: '#00ff88',
          nodeColors: ['#00ff88', '#00e5ff', '#10f5a0', '#34d399', '#6ee7b7'],
          webLineColor: '0, 255, 136',      // RGB for dynamic alpha
          cursorLineColor: '0, 229, 255',   // Cyan lines to cursor
          cursorGlow: '#00e5ff',
          cursorCore: '#10f5a0',
          haloBg: 'rgba(0, 229, 255, 0.08)'
        };
      }
      return {
        // Study Corner: Coral, Indigo & Golden Amber
        nodeColor: '#f06a55',
        nodeColors: ['#f06a55', '#fb923c', '#8b5cf6', '#38bdf8', '#f59e0b'],
        webLineColor: '240, 106, 85',
        cursorLineColor: '139, 92, 246',   // Indigo lines to cursor
        cursorGlow: '#f06a55',
        cursorCore: '#f06a55',
        haloBg: 'rgba(240, 106, 85, 0.08)'
      };
    };

    // Responsive particle count based on screen area (smooth 60-120fps)
    const getParticleCount = () => {
      const area = width * height;
      if (area < 700000) return 45;       // small laptops
      if (area < 1500000) return 65;      // standard 1080p desktop
      return 85;                          // 2K / 4K ultrawide
    };

    // Node Class
    class WebNode {
      constructor(x, y) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * height;
        
        // Gentle ambient drift velocity
        this.vx = (Math.random() - 0.5) * 1.1;
        this.vy = (Math.random() - 0.5) * 1.1;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        
        this.radius = Math.random() * 1.8 + 1.8; // 1.8px - 3.6px crisp node
        const config = getThemeConfig();
        this.color = config.nodeColors[Math.floor(Math.random() * config.nodeColors.length)];
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.03 + Math.random() * 0.02;
      }

      update() {
        this.pulseAngle += this.pulseSpeed;

        // Bounce gently off canvas edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse magnetic elasticity & spider-web pull
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            // Elastic tension: particles are drawn toward the cursor, creating spider-web tension
            const force = (1 - dist / mouse.radius) * 0.8;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.8;
            this.y += Math.sin(angle) * force * 1.8;
          }
        }

        // Apply normal drift
        this.x += this.vx;
        this.y += this.vy;

        // Damping back to base drift
        this.vx += (this.baseVx - this.vx) * 0.03;
        this.vy += (this.baseVy - this.vy) * 0.03;
      }

      draw(context) {
        context.save();
        const pulse = 1 + Math.sin(this.pulseAngle) * 0.2;
        context.beginPath();
        context.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 8;
        context.fill();
        context.restore();
      }
    }

    // Initialize particles array
    let particles = [];
    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new WebNode());
      }
    };
    initParticles();

    // Click Web Ripple Pulse
    const pulses = [];
    class WebPulse {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.maxRadius = 140;
        this.life = 1.0;
      }

      update() {
        this.life -= 0.028;
        this.radius += (this.maxRadius - this.radius) * 0.12;
        return this.life > 0;
      }

      draw(context) {
        const config = getThemeConfig();
        context.save();
        context.strokeStyle = `rgba(${config.cursorLineColor}, ${Math.max(0, this.life * 0.6)})`;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    }

    // Resize listener
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Mouse movement
    const handleMouseMove = (e) => {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest(
          'button, a, input, select, textarea, [role="button"], .clickable, .interactive, .subject-tab-btn, .module-tab-btn, .topic-list-item, .mission-item-btn, .gate-card, .podium-card, .mode-toggle-btn'
        )
      ) {
        mouse.isHovering = true;
        mouse.radius = 210; // expands web reach on interactive elements
      } else {
        mouse.isHovering = false;
        mouse.radius = 175;
      }
    };

    // Mouse click: trigger web shockwave pulse
    const handleMouseDown = (e) => {
      pulses.push(new WebPulse(e.clientX, e.clientY));
      
      // Repel nearby particles outward in a web burst
      particles.forEach((p) => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 0) {
          const force = (1 - dist / 150) * 8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.isHovering = false;
      mouse.x = -500;
      mouse.y = -500;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Draw the Spider Web / Plexus Connections
    const drawSpiderWeb = (context) => {
      const config = getThemeConfig();
      const nodeConnectDist = 115; // Distance between particles to form web
      const cursorConnectDist = mouse.radius; // Distance from cursor to particles

      // 1. Particle-to-Particle Web Interconnections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < nodeConnectDist) {
            // Brighter lines for closer particles
            const alpha = (1 - dist / nodeConnectDist) * 0.45;
            context.strokeStyle = `rgba(${config.webLineColor}, ${alpha})`;
            context.lineWidth = 0.8;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.stroke();
          }
        }

        // 2. Dynamic Spider-Web Filaments shooting directly from Cursor to Particles!
        if (mouse.active) {
          const distToCursor = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);

          if (distToCursor < cursorConnectDist) {
            // High visibility, crisp glowing web connection to the mouse
            const alpha = (1 - distToCursor / cursorConnectDist) * 0.85;
            context.strokeStyle = `rgba(${config.cursorLineColor}, ${alpha})`;
            context.lineWidth = 1.2 * (1 - distToCursor / cursorConnectDist) + 0.5;
            context.shadowColor = `rgb(${config.cursorLineColor})`;
            context.shadowBlur = 6;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
            context.shadowBlur = 0;
          }
        }
      }
    };

    // Draw Cursor Tech Nexus (Center point & Glowing ring)
    let reticlePulse = 0;
    const drawCursorNexus = (context) => {
      if (!mouse.active || mouse.x < 0) return;
      const config = getThemeConfig();
      reticlePulse += 0.05;

      context.save();

      // 1. Ambient Web Gravitational Field (Subtle glowing circle)
      const fieldRadius = mouse.isHovering ? 32 : 24;
      const grad = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, fieldRadius);
      grad.addColorStop(0, config.haloBg);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = grad;
      context.beginPath();
      context.arc(mouse.x, mouse.y, fieldRadius, 0, Math.PI * 2);
      context.fill();

      // 2. Spider Web Nexus Center Core
      context.beginPath();
      context.arc(mouse.x, mouse.y, mouse.isHovering ? 4.5 : 3.5, 0, Math.PI * 2);
      context.fillStyle = config.cursorCore;
      context.shadowColor = config.cursorGlow;
      context.shadowBlur = 10;
      context.fill();

      // 3. Delicate Orbit Ring
      const orbitRadius = (mouse.isHovering ? 14 : 9) + Math.sin(reticlePulse) * 1.5;
      context.strokeStyle = `rgba(${config.cursorLineColor}, 0.5)`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(mouse.x, mouse.y, orbitRadius, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    };

    // Render Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Spider Web connections
      drawSpiderWeb(ctx);

      // 2. Update and draw nodes
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // 3. Update and draw click pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (pulse.update()) {
          pulse.draw(ctx);
        } else {
          pulses.splice(i, 1);
        }
      }

      // 4. Draw Cursor Nexus
      drawCursorNexus(ctx);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
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
