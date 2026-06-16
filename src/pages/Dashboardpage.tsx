import React from 'react';
import { FolderOpen, CheckSquare, CheckCircle, TrendingUp } from 'lucide-react';
import { useDashboard } from '../queryhooks/useDashboard';
import { useProjects } from '../queryhooks/useProjects';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/layout/Pageheader';
import { LoadingSpinner, ErrorState } from '../components/common/States';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useDashboard();
  const { data: projects = [] } = useProjects();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner message="Loading dashboard…" />;
  if (isError || !stats) return <ErrorState message="Could not load dashboard stats." onRetry={refetch} />;

  const pct = stats.completionPercentage;
  const circumference = 2 * Math.PI * 44;
  const strokeDash = circumference - (pct / 100) * circumference;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Your project progress at a glance"
      />

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '36px',
      }}>
        <StatCard
          label="Total Projects"
          value={stats.totalProjects}
          icon={<FolderOpen size={18} />}
          accentColor="var(--accent)"
          sublabel="Active projects"
        />
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks}
          icon={<CheckSquare size={18} />}
          accentColor="var(--warning)"
          sublabel="Across all projects"
        />
        <StatCard
          label="Completed Tasks"
          value={stats.completedTasks}
          icon={<CheckCircle size={18} />}
          accentColor="var(--success)"
          sublabel={`${stats.openTasks} still open`}
        />
        <StatCard
          label="Completion"
          value={`${pct}%`}
          icon={<TrendingUp size={18} />}
          accentColor={pct === 100 ? 'var(--success)' : 'var(--accent)'}
          sublabel={pct === 100 ? 'All done! 🎉' : 'Keep going'}
        />
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
        {/* Recent projects */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '20px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
            RECENT PROJECTS
          </h2>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No projects yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {projects.slice(0, 6).map((p:any, i:any) => {
                const total = p.totalTasks ?? 0;
                const done = p.completedTasks ?? 0;
                const ppct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 0',
                      borderBottom: i < Math.min(projects.length, 6) - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: 'var(--r-sm)', flexShrink: 0,
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700,
                    }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 500, marginBottom: '4px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {p.name}
                      </div>
                      <div style={{ height: '3px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${ppct}%`, borderRadius: '2px',
                          background: ppct === 100 ? 'var(--success)' : 'var(--accent)',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {done}/{total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completion ring */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          minWidth: '180px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>
            OVERALL
          </h2>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={pct === 100 ? 'var(--success)' : 'var(--accent)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700"
              fill="var(--text-primary)" fontFamily="Inter, sans-serif">
              {pct}%
            </text>
            <text x="50" y="60" textAnchor="middle" fontSize="9"
              fill="var(--text-muted)" fontFamily="Inter, sans-serif">
              complete
            </text>
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {stats.completedTasks} of {stats.totalTasks} tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}