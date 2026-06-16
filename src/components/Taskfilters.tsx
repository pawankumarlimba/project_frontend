import React from 'react';
import { X } from 'lucide-react';
import { TaskFilters as Filters, TaskPriority, TaskStatus } from '../types';
import { Project } from '../types';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  projects?: Project[];
  showProjectFilter?: boolean;
}

const chip = (
  label: string,
  active: boolean,
  color: string,
  onClick: () => void
): React.ReactElement => (
  <button
    key={label}
    onClick={onClick}
    style={{
      padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
      cursor: 'pointer', border: `1px solid ${active ? color : 'var(--border)'}`,
      background: active ? color + '22' : 'var(--bg-surface)',
      color: active ? color : 'var(--text-secondary)',
      transition: 'all var(--t-fast)',
    }}
  >
    {label}
  </button>
);

export function TaskFilters({ filters, onChange, projects = [], showProjectFilter }: TaskFiltersProps) {
  const setStatus   = (s?: TaskStatus) => onChange({ ...filters, status: s });
  const setPriority = (p?: TaskPriority) => onChange({ ...filters, priority: p });
  const setProject  = (id?: string) => onChange({ ...filters, projectId: id });

  const hasFilters = !!(filters.status || filters.priority || filters.projectId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '52px', fontWeight: 500 }}>STATUS</span>
        {chip('All',  !filters.status,           'var(--text-primary)',  () => setStatus(undefined))}
        {chip('Open', filters.status === 'OPEN',  'var(--accent)',        () => setStatus('OPEN'))}
        {chip('Done', filters.status === 'DONE',  'var(--success)',       () => setStatus('DONE'))}
      </div>

      {/* Priority row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '52px', fontWeight: 500 }}>PRIORITY</span>
        {chip('All',    !filters.priority,              'var(--text-primary)',      () => setPriority(undefined))}
        {chip('Low',    filters.priority === 'LOW',    'var(--priority-low)',    () => setPriority('LOW'))}
        {chip('Medium', filters.priority === 'MEDIUM', 'var(--priority-medium)', () => setPriority('MEDIUM'))}
        {chip('High',   filters.priority === 'HIGH',   'var(--priority-high)',   () => setPriority('HIGH'))}
      </div>

      {/* Project row */}
      {showProjectFilter && projects.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '52px', fontWeight: 500 }}>PROJECT</span>
          {chip('All', !filters.projectId, 'var(--text-primary)', () => setProject(undefined))}
          {projects.map((p) =>
            chip(p.name, filters.projectId === p.id, 'var(--accent)', () => setProject(p.id))
          )}
        </div>
      )}

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={() => onChange({})}
          style={{
            alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '100px', fontSize: '11px',
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'color var(--t-fast)',
          }}
        >
          <X size={10} /> Clear filters
        </button>
      )}
    </div>
  );
}