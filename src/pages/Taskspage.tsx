import React, { useState } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { useTasks, useCreateTask, useUpdateTask, useToggleTaskStatus, useDeleteTask } from '../queryhooks/useTasks';
import { useProjects } from '../queryhooks/useProjects';
import { TaskCard } from '../components/Taskcard';
import { TaskForm } from '../components/Taskform';
import { TaskFilters } from '../components/Taskfilters';
import { ConfirmDialog } from '../components/common/Confirmdialog';
import { PageHeader } from '../components/layout/Pageheader';
import { Button } from '../components/common/Button';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/common/States';
import { useToast } from '../components/common/Toast';
import { Task, TaskFilters as Filters } from '../types';

export function TasksPage() {
  const [filters, setFilters]         = useState<Filters>({});
  const [formOpen, setFormOpen]       = useState(false);
  const [editTask, setEditTask]       = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [togglingId, setTogglingId]   = useState<string | null>(null);
  const { toast } = useToast();

  const { data: tasks = [], isLoading, isError, refetch } = useTasks(filters);
  const { data: projects = [] } = useProjects();

  const createTask   = useCreateTask();
  const updateTask   = useUpdateTask();
  const toggleStatus = useToggleTaskStatus();
  const deleteTask   = useDeleteTask();

  const projectMap = Object.fromEntries(projects.map((p:any) => [p.id, p.name]));

  const handleCreate = async (data: any) => {
    try {
      await createTask.mutateAsync(data);
      toast('Task created!');
      setFormOpen(false);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleUpdate = async (data: any) => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask.mutateAsync({ id: deleteTarget.id, projectId: deleteTarget.project_id });
      toast('Task deleted.');
      setDeleteTarget(null);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  if (isLoading) return <LoadingSpinner message="Loading tasks…" />;
  if (isError)   return <ErrorState message="Could not load tasks." onRetry={refetch} />;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '900px' }}>
      <PageHeader
        title="All Tasks"
        subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} found`}
        action={
          <Button icon={<Plus size={15} />} onClick={() => setFormOpen(true)}>
            New task
          </Button>
        }
      />

      {/* Filters panel */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)', padding: '16px 18px', marginBottom: '20px',
      }}>
        <TaskFilters
          filters={filters}
          onChange={setFilters}
          projects={projects}
          showProjectFilter
        />
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={40} />}
          title="No tasks found"
          description="Try clearing filters, or create a new task."
          action={
            <Button icon={<Plus size={14} />} onClick={() => setFormOpen(true)}>
              New task
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map((task:any) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              onDelete={setDeleteTarget}
              onToggle={handleToggle}
              toggleLoading={togglingId === task.id}
              showProject
              projectName={projectMap[task.project_id]}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createTask.isPending}
      />
      <TaskForm
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleUpdate}
        task={editTask}
        loading={updateTask.isPending}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleteTask.isPending}
      />
    </div>
  );
}