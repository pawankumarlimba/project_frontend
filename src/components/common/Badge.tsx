import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';

type BadgeVariant = 'default' | TaskPriority | TaskStatus;

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  default:  { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)' },
  LOW:      { bg: 'var(--success-dim)', color: 'var(--success)' },
  MEDIUM:   { bg: 'var(--warning-dim)', color: 'var(--warning)' },
  HIGH:     { bg: 'var(--danger-dim)',  color: 'var(--danger)' },
  OPEN:     { bg: 'var(--accent-dim)', color: 'var(--accent)' },
  DONE:     { bg: 'var(--success-dim)', color: 'var(--success)' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'default', children, style }: BadgeProps) {
  const { bg, color } = variantMap[variant] ?? variantMap.default;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '100px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        background: bg,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}