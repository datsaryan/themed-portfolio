import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

/**
 * Shared scroll-triggered reveal primitives used across every section.
 * Kept deliberately subtle (short duration, small offset) so it doesn't
 * fight with the existing BGM / click-sound / hanging-Spiderman effects.
 */

const EASE = [0.16, 1, 0.3, 1] as const; // "expo out" – snappy comic-panel feel

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  /** 0-1, how far into the viewport the element must be before animating */
  amount?: number;
  delay?: number;
  duration?: number;
  /** Re-animate every time it re-enters the viewport instead of only once */
  repeat?: boolean;
  as?: 'div' | 'section' | 'span';
}

const OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/** Fades + slides a single block in once it scrolls into view. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  direction = 'up',
  amount = 0.25,
  delay = 0,
  duration = 0.6,
  repeat = false,
  as = 'div',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const offset = OFFSETS[direction];
  const Component = motion[as];

  if (prefersReducedMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  staggerDelay?: number;
}

/** Wrap a grid/list of cards in this, then wrap each card in <RevealItem>. */
export const RevealStagger: React.FC<RevealStaggerProps> = ({
  children,
  className,
  amount = 0.15,
  staggerDelay = 0.1,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

// Omit the handful of DOM event props whose signatures collide with
// framer-motion's own (drag/animation events) — callers of RevealItem only
// ever pass onClick / onKeyDown / role / tabIndex / aria-* in this codebase.
type SafeDivAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>;

interface RevealItemProps extends SafeDivAttributes {
  children: React.ReactNode;
}

/** Extra props (onClick, role, tabIndex, aria-*, etc.) pass straight through to the card. */
export const RevealItem: React.FC<RevealItemProps> = ({ children, className, ...rest }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
};

export { staggerContainer };
