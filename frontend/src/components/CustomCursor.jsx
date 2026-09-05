import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;
    let isVisible = false;
    let animId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx - 6}px`;
      cursor.style.top = `${my - 6}px`;

      if (!isVisible) {
        cursor.style.opacity = '1';
        trail.style.opacity = '1';
        isVisible = true;
      }
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      trail.style.opacity = '0';
      isVisible = false;
    };

    const animateTrail = () => {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = `${tx - 18}px`;
      trail.style.top = `${ty - 18}px`;
      animId = requestAnimationFrame(animateTrail);
    };
    animId = requestAnimationFrame(animateTrail);

    const handleHoverStart = (e) => {
      const target = e.target.closest('a, button, .skill-chip, .project-card, .stat-box, .btn-primary, .btn-outline');
      if (target) {
        cursor.style.transform = 'scale(2.5)';
        cursor.style.background = 'var(--cyan)';
      }
    };

    const handleHoverEnd = (e) => {
      const target = e.target.closest('a, button, .skill-chip, .project-card, .stat-box, .btn-primary, .btn-outline');
      if (target) {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'var(--purple)';
      }
    };

    const handleClick = (e) => {
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: 6px;
          height: 6px;
          background: hsl(${270 + Math.random() * 60}, 80%, 70%);
          border-radius: 50%;
          pointer-events: none;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          z-index: 99997;
          transform: translate(-50%, -50%);
        `;
        document.body.appendChild(particle);

        const angle = (i / 6) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.animate(
          [
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
          ],
          { duration: 500, easing: 'ease-out' }
        ).onfinish = () => particle.remove();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} id="cursor"></div>
      <div className="cursor-trail" ref={trailRef} id="cursor-trail"></div>
    </>
  );
}
