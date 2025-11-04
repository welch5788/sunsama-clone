import {apiClient} from './client';
import type {CreateTaskInput, Task} from '../types/task';

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    dueDate?: string;
    plannedDate?: string
    timeEstimate?: number;
    actualTime?: number;
    startTime?: string;
}

export const taskApi = {
    // Get all tasks
    getTasks: async (): Promise<Task[]> => {
        const response = await apiClient.get('/api/tasks');
        return response.data;
    },

    // Create a task
    createTask: async (data: CreateTaskInput): Promise<Task> => {
        const response = await apiClient.post('/api/tasks', data);
        return response.data;
    },

    // Toggle task completion
    toggleTask: async (id: string): Promise<Task> => {
        const response = await apiClient.patch(`/api/tasks/${id}/toggle`);
        return response.data;
    },

    // Delete a task
    deleteTask: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/tasks/${id}`);
    },

    // Plan a task for a specific date
    planTask: async (id: string, plannedDate: string | null): Promise<Task> => {
        const response = await apiClient.patch(`/api/tasks/${id}/plan`, { plannedDate });
        return response.data;
    },

    // Update a task
    updateTask: async (id: string, data: UpdateTaskInput): Promise<Task> => {
        const response = await apiClient.patch(`/api/tasks/${id}`, data);
        return response.data;
    },

};