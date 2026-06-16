import client from './client';
import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters, ApiResponse } from '../types';

export const taskApi = {
  getAll: async (filters?: TaskFilters): Promise<Task[]> => {
    const res = await client.get<ApiResponse<Task[]>>('/tasks', { params: filters });
    return res.data.data!;
  },

  getById: async (id: string): Promise<Task> => {
    const res = await client.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data.data!;
  },

  create: async (dto: CreateTaskDto): Promise<Task> => {
    const res = await client.post<ApiResponse<Task>>('/tasks', dto);
    return res.data.data!;
  },

  update: async (id: string, dto: UpdateTaskDto): Promise<Task> => {
    const res = await client.put<ApiResponse<Task>>(`/tasks/${id}`, dto);
    return res.data.data!;
  },

  markDone: async (id: string): Promise<Task> => {
    const res = await client.patch<ApiResponse<Task>>(`/tasks/${id}/done`);
    return res.data.data!;
  },

  markOpen: async (id: string): Promise<Task> => {
    const res = await client.patch<ApiResponse<Task>>(`/tasks/${id}/open`);
    return res.data.data!;
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/tasks/${id}`);
  },
};