import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { projectApi } from '../api/projectApi';
import { queryKeys } from './Querykeys';
import { CreateProjectDto, UpdateProjectDto } from '../types';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectApi.getAll,
    staleTime: 1000 * 30,       // 30s — project list is fairly stable
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectApi.getById(id),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) =>
      projectApi.update(id, dto),
    onSuccess: (updated:any) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(updated.id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      // Tasks are cascade-deleted → invalidate task cache too
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}