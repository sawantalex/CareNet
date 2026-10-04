import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });

      // Check if hovering interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, .glass-card, .pill-badge, .icon-btn, .btn');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth lerp animation loop for outer ring
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      setRingPosition({ x: ringX, y: ringY });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Small Precision Inner Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--primary-gold-light)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${isClicking ? 0.6 : isHovered ? 1.4 : 1})`,
          transition: 'transform 0.15s ease-out, background-color 0.15s ease-out',
          boxShadow: '0 0 10px var(--primary-gold)'
        }}
      />

      {/* Smooth Trailing Outer Gold Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          border: '1.5px solid var(--primary-gold)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: `translate3d(${ringPosition.x - 18}px, ${ringPosition.y - 18}px, 0) scale(${isClicking ? 0.8 : isHovered ? 1.6 : 1})`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease-out, background-color 0.2s ease-out',
          backgroundColor: isHovered ? 'rgba(216, 180, 114, 0.12)' : 'transparent',
          boxShadow: isHovered
            ? '0 0 25px rgba(216, 180, 114, 0.4), inset 0 0 15px rgba(216, 180, 114, 0.2)'
            : '0 0 12px rgba(216, 180, 114, 0.2)'
        }}
      />
    </>
  );
};

export default CustomCursor;
