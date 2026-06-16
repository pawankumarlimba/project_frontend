import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Pencil, Trash2, CheckSquare } from 'lucide-react';
import { useProject, useUpdateProject, useDeleteProject } from '../queryhooks/useProjects';
import { useProjectTasks, useCreateTask, useUpdateTask, useToggleTaskStatus, useDeleteTask } from '../queryhooks/useTasks';
import { TaskCard } from '../components/Taskcard';
import { TaskForm } from '../components/Taskform';
import { TaskFilters } from '../components/Taskfilters';
import { ProjectForm } from '../components/Projectform';
import { ConfirmDialog } from '../components/common/Confirmdialog';
import { PageHeader } from '../components/layout/Pageheader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/common/States';
import { useToast } from '../components/common/Toast';
import { Task, TaskFilters as Filters } from '../types';

export function ProjectDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: project, isLoading: projLoading, isError: projError } = useProject(id);
  const { data: allTasks = [], isLoading: tasksLoading } = useProjectTasks(id);

  const createTask    = useCreateTask();
  const updateTask    = useUpdateTask();
  const toggleStatus  = useToggleTaskStatus();
  const deleteTask    = useDeleteTask();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [taskFormOpen,    setTaskFormOpen]    = useState(false);
  const [editTask,        setEditTask]        = useState<Task | null>(null);
  const [deleteTaskTarget,setDeleteTaskTarget]= useState<Task | null>(null);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteProjectOpen,setDeleteProjectOpen]=useState(false);
  const [filters,         setFilters]         = useState<Filters>({});
  const [togglingId,      setTogglingId]      = useState<string | null>(null);

  // Client-side filter on already-fetched tasks
  const filteredTasks = allTasks.filter((t:any) => {
    if (filters.status   && t.status   !== filters.status)   return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    return true;
  });

  const handleCreateTask = async (data: any) => {
    try {
      await createTask.mutateAsync({ ...data, projectId: id });
      toast('Task created!');
      setTaskFormOpen(false);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editTask) return;
    try {
      await updateTask.mutateAsync({ id: editTask.id, dto: data });
      toast('Task updated.');
      setEditTask(null);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleToggle = async (task: Task) => {
    setTogglingId(task.id);
    try {
      await toggleStatus.mutateAsync({ id: task.id, currentStatus: task.status });
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setTogglingId(null); }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskTarget) return;
    try {
      await deleteTask.mutateAsync({ id: deleteTaskTarget.id, projectId: id });
      toast('Task deleted.');
      setDeleteTaskTarget(null);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleUpdateProject = async (data: any) => {
    try {
      await updateProject.mutateAsync({ id, dto: data });
      toast('Project updated.');
      setEditProjectOpen(false);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutateAsync(id);
      toast('Project deleted.');
      navigate('/projects');
    } catch (e: any) { toast(e.message, 'error'); }
  };

  if (projLoading) return <LoadingSpinner message="Loading project…" />;
  if (projError || !project) return <ErrorState message="Project not found." />;

  const total = project.totalTasks ?? 0;
  const done  = project.completedTasks ?? 0;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '900px' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '12px',
          transition: 'color var(--t-fast)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
      >
        <ArrowLeft size={13} /> Back to projects
      </button>

      {/* Project header */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '22px 24px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>{project.name}</h1>
            {project.description && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                {project.description}
              </p>
            )}
            {/* Stats row */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <b style={{ color: 'var(--text-primary)' }}>{total}</b> tasks total
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <b style={{ color: 'var(--success)' }}>{done}</b> completed
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <b style={{ color: 'var(--accent)' }}>{project.openTasks}</b> open
              </span>
              <Badge variant={pct === 100 ? 'DONE' : 'OPEN'}>{pct}% done</Badge>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Button variant="secondary" size="sm" icon={<Pencil size={13} />}
              onClick={() => setEditProjectOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />}
              onClick={() => setDeleteProjectOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: '3px',
                background: pct === 100 ? 'var(--success)' : 'var(--accent)',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Tasks section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600 }}>
          Tasks
          {filteredTasks.length !== allTasks.length && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '13px', marginLeft: '8px' }}>
              ({filteredTasks.length} of {allTasks.length})
            </span>
          )}
        </h2>
        <Button icon={<Plus size={14} />} size="sm" onClick={() => setTaskFormOpen(true)}>
          Add task
        </Button>
      </div>

      {/* Filters */}
      {allTasks.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: '16px',
        }}>
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Task list */}
      {tasksLoading ? (
        <LoadingSpinner message="Loading tasks…" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={36} />}
          title={allTasks.length === 0 ? 'No tasks yet' : 'No tasks match filters'}
          description={allTasks.length === 0 ? 'Add your first task to this project.' : 'Try changing the filters above.'}
          action={allTasks.length === 0 ? (
            <Button icon={<Plus size={14} />} size="sm" onClick={() => setTaskFormOpen(true)}>
              Add task
            </Button>
          ) : undefined}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTasks.map((task:any) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              onDelete={setDeleteTaskTarget}
              onToggle={handleToggle}
              toggleLoading={togglingId === task.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={id}
        loading={createTask.isPending}
      />
      <TaskForm
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleUpdateTask}
        task={editTask}
        defaultProjectId={id}
        loading={updateTask.isPending}
      />
      <ConfirmDialog
        isOpen={!!deleteTaskTarget}
        onClose={() => setDeleteTaskTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete task"
        message={`Delete "${deleteTaskTarget?.title}"? This cannot be undone.`}
        loading={deleteTask.isPending}
      />
      <ProjectForm
        isOpen={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        project={project}
        loading={updateProject.isPending}
      />
      <ConfirmDialog
        isOpen={deleteProjectOpen}
        onClose={() => setDeleteProjectOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete project"
        message={`Delete "${project.name}"? All tasks inside will be permanently deleted.`}
        loading={deleteProject.isPending}
      />
    </div>
  );
}