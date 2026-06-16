import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accentColor: string;
  sublabel?: string;
}

export function StatCard({ label, value, icon, accentColor, sublabel }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color var(--t-base)',
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = accentColor + '44'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${accentColor}, transparent)`,
      }} />

      <div style={{
        width: '36px', height: '36px', borderRadius: 'var(--r-sm)',
        background: accentColor + '20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accentColor,
      }}>
        {icon}
      </div>

      <div>
        <div style={{
          fontSize: '28px', fontWeight: 700, lineHeight: 1, color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}