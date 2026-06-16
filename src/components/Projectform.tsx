import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Input, Textarea } from './common/Input';
import { Button } from './common/Button';
import { Project } from '../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  project?: Project | null;
  loading?: boolean;
}

export function ProjectForm({ isOpen, onClose, onSubmit, project, loading }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setErrors({});
    }
  }, [isOpen, project]);

  const validate = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = 'Name is required.';
    else if (name.trim().length > 255) errs.name = 'Name must be under 255 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit project' : 'New project'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="e.g. Website Redesign"
          value={name}
          onChange={(e:any) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Textarea
          label="Description (optional)"
          placeholder="What is this project about?"
          value={description}
          onChange={(e:any) => setDescription(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {project ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}