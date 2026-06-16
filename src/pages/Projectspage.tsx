import React, { useState } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../queryhooks/useProjects';
import { ProjectCard } from '../components/Projectcard';
import { ProjectForm } from '../components/Projectform';
import { ConfirmDialog } from '../components/common/Confirmdialog';
import { PageHeader } from '../components/layout/Pageheader';
import { Button } from '../components/common/Button';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/common/States';
import { useToast } from '../components/common/Toast';
import { Project } from '../types';

export function ProjectsPage() {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const handleCreate = async (data: { name: string; description?: string }) => {
    try {
      await createProject.mutateAsync(data);
      toast('Project created successfully!');
      setFormOpen(false);
    } catch (e: any) {
      toast(e.message ?? 'Failed to create project.', 'error');
    }
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editTarget) return;
    try {
      await updateProject.mutateAsync({ id: editTarget.id, dto: data });
      toast('Project updated.');
      setEditTarget(null);
    } catch (e: any) {
      toast(e.message ?? 'Failed to update project.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      toast('Project deleted.');
      setDeleteTarget(null);
    } catch (e: any) {
      toast(e.message ?? 'Failed to delete project.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading projects…" />;
  if (isError)   return <ErrorState message="Could not load projects." onRetry={refetch} />;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        action={
          <Button icon={<Plus size={15} />} onClick={() => setFormOpen(true)}>
            New project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={40} />}
          title="No projects yet"
          description="Create your first project to start organising tasks."
          action={
            <Button icon={<Plus size={15} />} onClick={() => setFormOpen(true)}>
              New project
            </Button>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {projects.map((p:any) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={(proj:any) => setEditTarget(proj)}
              onDelete={(proj:any) => setDeleteTarget(proj)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <ProjectForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createProject.isPending}
      />

      {/* Edit modal */}
      <ProjectForm
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        project={editTarget}
        loading={updateProject.isPending}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete project"
        message={`Delete "${deleteTarget?.name}"? This will also permanently delete all its tasks.`}
        loading={deleteProject.isPending}
      />
    </div>
  );
}