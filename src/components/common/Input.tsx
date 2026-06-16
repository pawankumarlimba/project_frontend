import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const fieldBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--text-primary)',
  padding: '8px 12px',
  outline: 'none',
  transition: 'border-color var(--t-fast)',
};

export function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        style={{
          ...fieldBase,
          borderColor: error ? 'var(--danger)' : undefined,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)';
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
          onBlur?.(e);
        }}
        {...rest}
      />
      {error && (
        <span style={{ fontSize: '11px', color: 'var(--danger)' }}>{error}</span>
      )}
    </div>
  );
}

export function Textarea({ label, error, style, onFocus, onBlur, ...rest }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <textarea
        rows={3}
        style={{
          ...fieldBase,
          resize: 'vertical',
          borderColor: error ? 'var(--danger)' : undefined,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)';
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
          onBlur?.(e);
        }}
        {...rest}
      />
      {error && (
        <span style={{ fontSize: '11px', color: 'var(--danger)' }}>{error}</span>
      )}
    </div>
  );
}