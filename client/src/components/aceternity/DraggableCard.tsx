import { createContext, useContext, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Aceternity UI's "Draggable Card" component
 * (ui.aceternity.com/components/draggable-card) — a free, copy-paste
 * component: cards that tilt toward the cursor on hover and can be freely
 * dragged, snapping back to their resting position on release. Reproduced
 * from memory (their docs page only exposes source via an interactive tab
 * this environment can't render) with framer-motion's built-in
 * `dragSnapToOrigin` driving the release behavior.
 */

const MouseEnterContext = createContext<[boolean, (v: boolean) => void] | undefined>(undefined);

export function DraggableCardContainer({ className, children }: { className?: string; children: ReactNode }) {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn('relative', className)}>{children}</div>
    </MouseEnterContext.Provider>
  );
}

interface DraggableCardBodyProps {
  className?: string;
  children: ReactNode;
  rotate?: number;
}

export function DraggableCardBody({ className, children, rotate = 0 }: DraggableCardBodyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(MouseEnterContext);
  const setIsMouseEntered = context?.[1] ?? (() => {});

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 250, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 250, damping: 20 });
  const scale = useSpring(1, { stiffness: 250, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    setIsMouseEntered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.35}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 22 }}
      whileDrag={{ scale: 1.06, zIndex: 50, cursor: 'grabbing' }}
      onMouseEnter={() => {
        setIsMouseEntered(true);
        scale.set(1.04);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ rotate }}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      className={cn(
        'elevated-card cursor-grab touch-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
