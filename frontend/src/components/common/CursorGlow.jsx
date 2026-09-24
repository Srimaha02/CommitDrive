import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

/**
 * Fluid Magnetic Halo & Velocity Stretch Cursor
 * 
 * Inspired by Linear.app, Vercel, and Apple interactions:
 * - 100% clean background when idle (zero clutter, zero lines, zero floating terms).
 * - Ultra-responsive Precision Dot: Follows cursor directly with zero lag.
 * - Fluid Lagging Halo with Spring Physics: Trails organically behind the dot.
 * - Velocity Stretch & Squash: Dynamically stretches along the angle of movement into an aerodynamic ellipse when moving quickly, rounding back to a perfect circle when slowing down.
 * - Magnetic Hover & Expansion: Gently snaps and expands around buttons/interactive elements.
 * - Theme-reactive: Adapts dynamically to Terminal (Matrix Emerald) & Study (Indigo / Slate) themes.
 */
export default function CursorGlow() {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Only enable for fine pointer devices (desktops/laptops with mouse/trackpad)
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || prefersReducedMotion) return;

    const dot = dotRef.current;
    const halo = haloRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !halo || !spotlight) return;

    // Mouse coordinates
    let mouseX = -500;
    let mouseY = -500;
    let prevMouseX = -500;
    let prevMouseY = -500;
    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;

    // Halo physics (Lagging spring position)
    let haloX = -500;
    let haloY = -500;
    let haloAngle = 0;
    let currentScaleX = 1;
    let currentScaleY = 1;

    // Magnetic target
    let magneticTarget = null;
    let targetX = -500;
    let targetY = -500;

    let animFrameId = null;

    const handleMouseMove = (e) => {
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        halo.style.opacity = '1';
        spotlight.style.opacity = '1';
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check magnetic hover over interactive targets
      const target = e.target;
      const targetEl = target instanceof Element ? target : target?.parentElement;
      const interactiveEl = targetEl?.closest?.(
        'button, a, input, select, textarea, [role="button"], .clickable, .interactive, .subject-tab-btn, .module-tab-btn, .topic-list-item, .mission-item-btn, .mode-toggle-btn, .tab-btn'
      );

      if (interactiveEl && typeof interactiveEl.getBoundingClientRect === 'function') {
        isHovering = true;
        const rect = interactiveEl.getBoundingClientRect();
        // Magnetic pull towards center of element (weighted 40% towards center, 60% towards mouse)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        magneticTarget = {
          x: centerX,
          y: centerY,
          width: rect.width,
          height: rect.height
        };
      } else {
        isHovering = false;
        magneticTarget = null;
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      halo.style.opacity = '0';
      spotlight.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      halo.style.opacity = '1';
      spotlight.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Render loop with high-precision physics
    const render = () => {
      if (mouseX > -100) {
        // 1. Position Precision Dot instantly with zero lag
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
          isMouseDown ? 0.6 : isHovering ? 0.4 : 1
        })`;

        // 2. Calculate target position for halo (magnetic attraction)
        if (isHovering && magneticTarget) {
          // Attract smoothly toward element center
          targetX = mouseX + (magneticTarget.x - mouseX) * 0.35;
          targetY = mouseY + (magneticTarget.y - mouseY) * 0.35;
        } else {
          targetX = mouseX;
          targetY = mouseY;
        }

        // Initialize positions on first render
        if (haloX === -500) {
          haloX = targetX;
          haloY = targetY;
          prevMouseX = mouseX;
          prevMouseY = mouseY;
        }

        // 3. Lagging spring interpolation
        const springFactor = isHovering ? 0.22 : 0.16;
        haloX += (targetX - haloX) * springFactor;
        haloY += (targetY - haloY) * springFactor;

        // 4. Calculate velocity & direction for stretching
        const vx = mouseX - prevMouseX;
        const vy = mouseY - prevMouseY;
        const speed = Math.hypot(vx, vy);

        prevMouseX = mouseX;
        prevMouseY = mouseY;

        // Calculate stretch and angle
        if (!isHovering && speed > 1.2) {
          const targetAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
          // Smooth angle transition
          haloAngle = targetAngle;

          // Stretch along velocity vector, squash perpendicularly (area conservation)
          const stretch = Math.min(speed * 0.028, 0.85);
          const targetScaleX = 1 + stretch;
          const targetScaleY = 1 / (1 + stretch * 0.5);

          currentScaleX += (targetScaleX - currentScaleX) * 0.25;
          currentScaleY += (targetScaleY - currentScaleY) * 0.25;
        } else {
          // Smoothly return to circle when slowing down or hovering
          currentScaleX += (1 - currentScaleX) * 0.2;
          currentScaleY += (1 - currentScaleY) * 0.2;
        }

        // 5. Apply transforms
        const hoverScale = isHovering ? 1.55 : 1;
        const clickScale = isMouseDown ? 0.85 : 1;
        const finalScaleX = currentScaleX * hoverScale * clickScale;
        const finalScaleY = currentScaleY * hoverScale * clickScale;

        halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%) rotate(${haloAngle}deg) scale(${finalScaleX}, ${finalScaleY})`;

        // 6. Ambient spotlight follows the halo smoothly
        spotlight.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="fluid-cursor-container" aria-hidden="true">
      {/* Soft Ambient Spotlight */}
      <div ref={spotlightRef} className="fluid-ambient-spotlight" />
      {/* Elastic Trailing Halo */}
      <div ref={haloRef} className="fluid-halo" />
      {/* High-Precision Center Dot */}
      <div ref={dotRef} className="fluid-dot" />
    </div>
  );
}
