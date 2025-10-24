import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {taskApi, type UpdateTaskInput} from '../api/tasks';
import type {CreateTaskInput, Task} from '../types/task';
import { TaskItem } from '../components/TaskItem';
import { CreateTaskForm } from '../components/CreateTaskForm';
import {EditTaskModal} from "../components/EditTaskModal.tsx";
import {useState} from "react";

export function Tasks() {
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const queryClient = useQueryClient();

    // Fetch tasks
    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskApi.getTasks,
    });

    // Create task mutation
    const createMutation = useMutation({
        mutationFn: taskApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // Toggle task mutation
    const toggleMutation = useMutation({
        mutationFn: taskApi.toggleTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // Delete task mutation
    const deleteMutation = useMutation({
        mutationFn: taskApi.deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // Planned Date mutation
    const planMutation = useMutation({
        mutationFn: ({ id, plannedDate }: { id: string; plannedDate: string | null }) =>
            taskApi.planTask(id, plannedDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });


    // Update task mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => taskApi.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setEditingTask(null);
        },
    });

    const handlePlanForToday = (id: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        planMutation.mutate({ id, plannedDate: today.toISOString() });
    };

    const handleCreateTask = (data: CreateTaskInput) => {
        createMutation.mutate(data);
    };

    const handleToggleTask = (id: string) => {
        toggleMutation.mutate(id);
    };

    const handleDeleteTask = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    }

    const handleSaveEdit = (id: string, data: UpdateTaskInput) => {
        updateMutation.mutate({ id, data });
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Tasks</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Task Form - Left Side */}
                    <div className="lg:col-span-1">
                        <CreateTaskForm
                            onSubmit={handleCreateTask}
                            isLoading={createMutation.isPending}
                        />
                    </div>

                    {/* Task List - Right Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                All Tasks ({tasks?.length || 0})
                            </h2>

                            {isLoading && (
                                <p className="text-gray-500">Loading tasks...</p>
                            )}

                            {error && (
                                <p className="text-red-500">Failed to load tasks</p>
                            )}

                            {tasks && tasks.length === 0 && (
                                <p className="text-gray-500">No tasks yet. Create one to get started!</p>
                            )}

                            <div className="space-y-3">
                                {tasks?.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                        onDelete={handleDeleteTask}
                                        onPlanForToday={handlePlanForToday}
                                        onEdit={handleEdit}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {editingTask && (<EditTaskModal
                task={editingTask!}
                isOpen={true}
                onClose={() => setEditingTask(null)}
                onSave={handleSaveEdit}
                isLoading={updateMutation.isPending}
            />)}
        </div>
    );
}