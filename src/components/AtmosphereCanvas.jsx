import React, { useEffect, useRef } from 'react';

export const AtmosphereCanvas = ({ weatherTheme = 'default', theme = 'dark' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system
    const isNight = weatherTheme.includes('night') || theme === 'dark' || theme === 'aurora';
    const isRain = weatherTheme.includes('rain') || weatherTheme.includes('thunderstorm');
    const isSnow = weatherTheme.includes('snow');

    const particleCount = isRain ? 45 : isSnow ? 35 : isNight ? 50 : 25;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isNight && !isRain && !isSnow ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
        speedY: isRain ? Math.random() * 8 + 6 : isSnow ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.2,
        speedX: isRain ? -1 : isSnow ? Math.sin(i) * 0.8 : (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (isRain) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2.5);
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (isSnow) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else {
          // Floating stars / ambient dust
          p.opacity += Math.sin(Date.now() * p.twinkleSpeed) * 0.01;
          const clampedOpacity = Math.max(0.1, Math.min(0.7, p.opacity));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          const color = theme === 'aurora' ? 'rgba(56, 189, 248,' : 'rgba(255, 255, 255,';
          ctx.fillStyle = `${color} ${clampedOpacity})`;
          ctx.shadowBlur = p.radius > 1 ? 6 : 0;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherTheme, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="atmosphere-canvas"
      aria-hidden="true"
    />
  );
};

export default AtmosphereCanvas;
