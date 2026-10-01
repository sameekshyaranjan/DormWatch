import React, { useCallback, useRef, useState } from 'react';
import { Icon } from './Icon';

type Side = { src: string; alt: string; label: string };

interface CompareSliderProps {
  before: Side;
  after: Side;
  /** Controlled position (0–100). Left side ("before") is visible up to this percentage. */
  position: number;
  onPositionChange: (value: number) => void;
  onInteract?: () => void;
  ariaLabel: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Before/after image comparison. Drag anywhere (mouse or touch) or focus the
 * handle and use the arrow keys.
 */
export function CompareSlider({
  before,
  after,
  position,
  onPositionChange,
  onInteract,
  ariaLabel,
  className = '',
  children,
}: CompareSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      onPositionChange(Math.max(0, Math.min(100, pct)));
    },
    [onPositionChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onInteract?.();
    setFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft') onPositionChange(Math.max(0, position - step));
    else if (e.key === 'ArrowRight') onPositionChange(Math.min(100, position + step));
    else if (e.key === 'Home') onPositionChange(0);
    else if (e.key === 'End') onPositionChange(100);
    else return;
    e.preventDefault();
    onInteract?.();
  };

  return (
    <div
      ref={ref}
      className={`compare ${dragging ? 'is-dragging' : ''} ${className}`}
      style={{ '--pos': `${position}%` } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <img className="compare-img" src={after.src} alt={after.alt} draggable={false} loading="lazy" />
      <div className="compare-before" aria-hidden={position < 2}>
        <img className="compare-img" src={before.src} alt={before.alt} draggable={false} loading="lazy" />
      </div>
      <span className="compare-label compare-label--before" style={{ opacity: position > 14 ? 1 : 0 }}>{before.label}</span>
      <span className="compare-label compare-label--after" style={{ opacity: position < 86 ? 1 : 0 }}>{after.label}</span>
      <div
        className="compare-handle"
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% ${before.label}`}
        onKeyDown={onKeyDown}
      >
        <span className="compare-knob">
          <Icon name="arrowLeft" size={14} />
          <Icon name="arrow" size={14} />
        </span>
      </div>
      {children}
    </div>
  );
}
