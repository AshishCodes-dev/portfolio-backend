import React, { useEffect, useRef } from 'react';

export default function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const CHARS = 'アイウエオカキクケコサシスセソタチツテ01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ</>{}[]=>.!#$%^&*()functionconst letvar';
    const SIZE = 13;
    let drops = [];
    let cols = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / SIZE);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 27, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const alpha = Math.random() > 0.6 ? 0.9 : 0.3;
        const color = Math.random() > 0.85
          ? `rgba(0, 212, 255, ${alpha})`
          : `rgba(129, 52, 202, ${alpha})`;

        ctx.fillStyle = color;
        ctx.font = `${SIZE}px JetBrains Mono`;
        ctx.fillText(char, i * SIZE, drops[i] * SIZE);

        if (drops[i] * SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="matrix-canvas" ref={canvasRef} />;
}
