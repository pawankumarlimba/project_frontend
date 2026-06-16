import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { queryKeys } from './Querykeys';
import { CreateTaskDto, TaskFilters, UpdateTaskDto } from '../types';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.all(filters),
    queryFn: () => taskApi.getAll(filters),
    staleTime: 1000 * 20,       // 20s — tasks change more often
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskApi.getById(id),
    staleTime: 1000 * 20,
    enabled: !!id,
  });
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn: () => taskApi.getAll({ projectId }),
    staleTime: 1000 * 20,
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: (task:any) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(task.project_id) });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) =>
      taskApi.update(id, dto),
    onSuccess: (task:any) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(task.project_id) });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useToggleTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: string }) =>
      currentStatus === 'DONE' ? taskApi.markOpen(id) : taskApi.markDone(id),
    onSuccess: (task:any) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(task.project_id) });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: { id: string; projectId: string }) => taskApi.remove(task.id),
    onSuccess: (_:any, task:any) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(task.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}