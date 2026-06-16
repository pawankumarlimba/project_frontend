import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, CheckSquare, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',         label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
  { to: '/projects', label: 'Projects',  icon: <FolderOpen size={17} /> },
  { to: '/tasks',    label: 'Tasks',     icon: <CheckSquare size={17} /> },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent), #9B93FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={16} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>TaskFlow</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Project Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600,
          letterSpacing: '0.08em', padding: '6px 10px 8px', textTransform: 'uppercase' }}>
          Menu
        </div>
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: 'var(--r-sm)', fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                transition: 'all var(--t-fast)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-elevated)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              {icon}
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: '11px', color: 'var(--text-muted)',
      }}>
        Task Management Platform
      </div>
    </aside>
  );
}