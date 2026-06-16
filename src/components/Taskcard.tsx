import React, { useState } from 'react';
import { Check, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Task } from '../types';
import { Badge } from './common/Badge';
import { Button } from './common/Button';

const PRIORITY_COLOR: Record<string, string> = {
  LOW:    'var(--priority-low)',
  MEDIUM: 'var(--priority-medium)',
  HIGH:   'var(--priority-high)',
};

interface TaskCardProps {
  task: Task;
  onEdit:   (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
  showProject?: boolean;
  projectName?: string;
  toggleLoading?: boolean;
}

export function TaskCard({
  task, onEdit, onDelete, onToggle, showProject, projectName, toggleLoading,
}: TaskCardProps) {
  const [hovered, setHovered] = useState(false);
  const isDone = task.status === 'DONE';
  const priorityColor = PRIORITY_COLOR[task.priority];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-focus)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: '0',
        overflow: 'hidden',
        transition: 'border-color var(--t-base), transform var(--t-base), box-shadow var(--t-base)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? `0 4px 20px ${priorityColor}18` : 'none',
        opacity: isDone ? 0.7 : 1,
      }}
    >
      {/* Priority strip — the signature visual element */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, ${priorityColor}, ${priorityColor}44)`,
        transition: 'opacity var(--t-base)',
        opacity: isDone ? 0.4 : 1,
      }} />

      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          disabled={toggleLoading}
          style={{
            flexShrink: 0, marginTop: '2px',
            width: '18px', height: '18px',
            borderRadius: '4px',
            border: `2px solid ${isDone ? 'var(--success)' : 'var(--border)'}`,
            background: isDone ? 'var(--success)' : 'transparent',
            cursor: toggleLoading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--t-fast)',
          }}
        >
          {isDone && <Check size={11} color="#0F1117" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 500, fontSize: '13px', marginBottom: '4px',
            textDecoration: isDone ? 'line-through' : 'none',
            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {task.title}
          </div>

          {task.description && (
            <p style={{
              fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Badge variant={task.priority}>{task.priority}</Badge>
            <Badge variant={task.status}>{task.status}</Badge>
            {showProject && projectName && (
              <span style={{
                fontSize: '11px', color: 'var(--text-muted)',
                padding: '2px 7px', borderRadius: '100px',
                background: 'var(--bg-elevated)',
              }}>
                {projectName}
              </span>
            )}
          </div>
        </div>

        {/* Actions — visible on hover */}
        <div style={{
          display: 'flex', gap: '4px', flexShrink: 0,
          opacity: hovered ? 1 : 0, transition: 'opacity var(--t-fast)',
        }}>
          <ActionBtn
            icon={isDone ? <RotateCcw size={13} /> : <Check size={13} />}
            title={isDone ? 'Mark open' : 'Mark done'}
            onClick={() => onToggle(task)}
            color="var(--success)"
          />
          <ActionBtn icon={<Pencil size={13} />} title="Edit" onClick={() => onEdit(task)} color="var(--accent)" />
          <ActionBtn icon={<Trash2 size={13} />} title="Delete" onClick={() => onDelete(task)} color="var(--danger)" />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, title, onClick, color }: {
  icon: React.ReactNode; title: string; onClick: () => void; color: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: '26px', height: '26px', border: 'none', borderRadius: 'var(--r-sm)',
        background: 'transparent', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color,
        transition: 'background var(--t-fast)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >
      {icon}
    </button>
  );
}