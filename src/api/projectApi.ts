import client from './client';
import { Project, CreateProjectDto, UpdateProjectDto, ApiResponse } from '../types';

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await client.get<ApiResponse<Project[]>>('/projects');
    return res.data.data!;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await client.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data!;
  },

  create: async (dto: CreateProjectDto): Promise<Project> => {
    const res = await client.post<ApiResponse<Project>>('/projects', dto);
    return res.data.data!;
  },

  update: async (id: string, dto: UpdateProjectDto): Promise<Project> => {
    const res = await client.put<ApiResponse<Project>>(`/projects/${id}`, dto);
    return res.data.data!;
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/projects/${id}`);
  },
};