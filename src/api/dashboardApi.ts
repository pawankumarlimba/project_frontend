import client from './client';
import { DashboardStats, ApiResponse } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await client.get<ApiResponse<DashboardStats>>('/dashboard');
    return res.data.data!;
  },
};