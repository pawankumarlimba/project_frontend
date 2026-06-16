import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, MoreVertical, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Project } from '../types';
import { Button } from './common/Button';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const total = project.totalTasks ?? 0;
  const done = project.completedTasks ?? 0;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color var(--t-base), transform var(--t-base)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: 'var(--r-sm)', flexShrink: 0,
          background: 'var(--accent-dim)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FolderOpen size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.name}
          </h3>
          {project.description && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Actions menu */}
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost" size="sm"
            style={{ padding: '4px' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={15} />
          </Button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
              <div style={{
                position: 'absolute', top: '100%', right: 0, zIndex: 100, marginTop: '4px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)',
                minWidth: '140px', overflow: 'hidden',
              }}>
                <MenuButton icon={<Pencil size={13} />} onClick={() => { setMenuOpen(false); onEdit(project); }}>
                  Edit
                </MenuButton>
                <MenuButton icon={<Trash2 size={13} />} danger onClick={() => { setMenuOpen(false); onDelete(project); }}>
                  Delete
                </MenuButton>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {done}/{total} tasks complete
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: pct === 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '2px', width: `${pct}%`,
            background: pct === 100 ? 'var(--success)' : 'var(--accent)',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Footer stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Chip value={project.openTasks ?? 0} label="open" color="var(--accent)" />
        <Chip value={project.completedTasks ?? 0} label="done" color="var(--success)" />
        {pct === 100 && total > 0 && (
          <span style={{ marginLeft: 'auto', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <CheckCircle size={12} /> All done
          </span>
        )}
      </div>
    </div>
  );
}

function Chip({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
      <span style={{ fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
    </span>
  );
}

function MenuButton({ icon, children, onClick, danger }: {
  icon: React.ReactNode; children: React.ReactNode; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        width: '100%', padding: '9px 14px', background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '12px', textAlign: 'left',
        color: danger ? 'var(--danger)' : 'var(--text-primary)',
        transition: 'background var(--t-fast)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
    >
      {icon} {children}
    </button>
  );
}