import { TaskFilters } from '../types';

export const queryKeys = {
  dashboard: ['dashboard'] as const,

  projects: {
    all:    ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },

  tasks: {
    all:      (filters?: TaskFilters) => ['tasks', filters ?? {}] as const,
    detail:   (id: string) => ['tasks', id] as const,
    byProject:(projectId: string) => ['tasks', { projectId }] as const,
  },
};