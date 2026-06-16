import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Input, Textarea } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useProjects } from '../queryhooks/useProjects';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    projectId: string;
  }) => Promise<void>;
  task?: Task | null;
  defaultProjectId?: string;
  loading?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 'LOW',    label: '🟢  Low' },
  { value: 'MEDIUM', label: '🟡  Medium' },
  { value: 'HIGH',   label: '🔴  High' },
];

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'DONE', label: 'Done' },
];

export function TaskForm({
  isOpen, onClose, onSubmit, task, defaultProjectId, loading,
}: TaskFormProps) {
  const { data: projects = [] } = useProjects();

  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]     = useState<TaskPriority>('MEDIUM');
  const [status, setStatus]         = useState<TaskStatus>('OPEN');
  const [projectId, setProjectId]   = useState('');
  const [errors, setErrors]         = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setPriority(task?.priority ?? 'MEDIUM');
      setStatus(task?.status ?? 'OPEN');
      setProjectId(task?.project_id ?? defaultProjectId ?? projects[0]?.id ?? '');
      setErrors({});
    }
  }, [isOpen, task, defaultProjectId, projects]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim())           errs.title     = 'Title is required.';
    else if (title.length > 255) errs.title     = 'Title must be under 255 characters.';
    if (!projectId)              errs.projectId = 'Please select a project.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      projectId,
    });
  };

  const projectOptions = projects.map((p:any) => ({ value: p.id, label: p.name }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'New task'} width={520}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Title"
          placeholder="e.g. Design homepage mockup"
          value={title}
          onChange={(e:any) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />
        <Textarea
          label="Description (optional)"
          placeholder="What needs to be done?"
          value={description}
          onChange={(e:any) => setDescription(e.target.value)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(e:any) => setPriority(e.target.value as TaskPriority)}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e:any) => setStatus(e.target.value as TaskStatus)}
          />
        </div>
        {!defaultProjectId && (
          <Select
            label="Project"
            options={projectOptions}
            value={projectId}
            placeholder="Select a project…"
            onChange={(e:any) => setProjectId(e.target.value)}
            error={errors.projectId}
          />
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {task ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}