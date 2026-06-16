import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading…' }: { message?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '12px', padding: '60px 20px',
      color: 'var(--text-muted)',
    }}>
      <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
      <span style={{ fontSize: '13px' }}>{message}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '12px', padding: '60px 20px',
      textAlign: 'center',
    }}>
      {icon && (
        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{icon}</div>
      )}
      <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{title}</p>
      {description && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '12px', padding: '60px 20px',
      textAlign: 'center',
    }}>
      <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Something went wrong</p>
      {message && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '7px 16px', borderRadius: 'var(--r-sm)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}