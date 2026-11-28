import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CursorGlowProps {
  className?: string;
  size?: number;
}


export function CursorGlow({ className, size = 560 }: CursorGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 120, damping: 25, mass: 0.5 });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div ref={containerRef} className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute rounded-full opacity-60 blur-3xl"
        style={{
          width: size,
          height: size,
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
