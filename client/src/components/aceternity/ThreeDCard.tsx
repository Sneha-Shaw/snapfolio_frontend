import { useRef, type ComponentPropsWithoutRef, type ElementType, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Aceternity UI's "3D Card Effect" component
 * (ui.aceternity.com/components/3d-card-effect) — a free, copy-paste
 * component: a card that tilts toward the cursor while its children sit at
 * different Z depths, producing a layered parallax illusion. Reproduced from
 * memory (their docs page only exposes source via an interactive tab this
 * environment can't render). This version drives the tilt via a CSS custom
 * property set imperatively on the container's DOM node rather than React
 * context, avoiding a re-render on every mouse move.
 */

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardContainer({ children, className, containerClassName }: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -20;
    el.style.setProperty('--rotate-x', `${y}deg`);
    el.style.setProperty('--rotate-y', `${x}deg`);
  }

  function handleMouseLeave() {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--rotate-x', '0deg');
    el.style.setProperty('--rotate-y', '0deg');
  }

  return (
    <div className="flex items-center justify-center" style={{ perspective: '1000px' }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseLeave}
        className={cn(
          'relative flex items-center justify-center transition-all duration-200 ease-linear',
          containerClassName
        )}
      >
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div
      className={cn('h-96 w-96 transition-all duration-200 ease-linear [transform-style:preserve-3d]', className)}
      style={{ transform: 'rotateY(var(--rotate-y, 0deg)) rotateX(var(--rotate-x, 0deg))' }}
    >
      {children}
    </div>
  );
}

function toUnit(value: number | string | undefined, unit: 'px' | 'deg'): string {
  if (value === undefined) return '0' + unit;
  return typeof value === 'number' ? `${value}${unit}` : value;
}

type CardItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export function CardItem<T extends ElementType = 'div'>({
  as,
  children,
  className,
  translateX,
  translateY,
  translateZ,
  rotateX,
  rotateY,
  rotateZ,
  ...rest
}: CardItemProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  const transform = [
    `translateX(${toUnit(translateX, 'px')})`,
    `translateY(${toUnit(translateY, 'px')})`,
    `translateZ(${toUnit(translateZ, 'px')})`,
    `rotateX(${toUnit(rotateX, 'deg')})`,
    `rotateY(${toUnit(rotateY, 'deg')})`,
    `rotateZ(${toUnit(rotateZ, 'deg')})`,
  ].join(' ');

  return (
    <Component className={className} style={{ transform, transformStyle: 'preserve-3d' }} {...rest}>
      {children}
    </Component>
  );
}
