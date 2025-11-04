import React, {useState} from "react";
import {formatWeekRange, getWeekDates} from "../utils/dateUtils.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {taskApi, type UpdateTaskInput} from "../api/tasks.ts";
import type {Task} from "../types/task.ts";

export function Week() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const weekDates = getWeekDates(currentWeek);

    const queryClient = useQueryClient();

    const {data: allTasks = []} = useQuery({
        queryKey: ['tasks'],
        queryFn: taskApi.getTasks,
    });

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getTasksForDay = (date: Date) => {
        const targetDate = date.toISOString().split('T')[0];
        return allTasks.filter(task => {
            if (!task.plannedDate) return false;
            const taskDate = task.plannedDate.split('T')[0];
            return taskDate === targetDate;
        })
    }

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleDrop = (date: Date) => {
        if (!draggedTask) return;

        const newPlannedDate = date.toISOString().split('T')[0];

        updateTaskMutation.mutate({
            id: draggedTask.id,
            data: {plannedDate: newPlannedDate}
        });

        setDraggedTask(null);
    };

    const updateTaskMutation = useMutation({
        mutationFn: ({id, data}: { id: string; data: UpdateTaskInput }) =>
            taskApi.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    return (
        <div className="max-w full mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Week of {formatWeekRange(weekDates)}
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const prev = new Date(currentWeek);
                            prev.setDate(prev.getDate() - 7);
                            setCurrentWeek(prev);
                        }}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => setCurrentWeek(new Date())}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => {
                            const next = new Date(currentWeek);
                            next.setDate(next.getDate() + 7);
                            setCurrentWeek(next);
                        }}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* 7-day grid goes here */}
            <div className="grid grid-cols-7 gap-4">
                {weekDates.map((date, i) => {
                    const dayTasks = getTasksForDay(date);

                    return (
                        <div
                            key={i}
                            className={`border rounded-lg p-3 ${
                                isToday(date) ? 'bg-blue-50 border-blue-300' : 'bg-white'
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(date)}
                        >
                            <div className="text-center mb-2">
                                <div className="text-xs font-medium text-gray-500">
                                    {date.toLocaleDateString('en-US', {weekday: 'short'})}
                                </div>
                                <div className={`text-lg font-bold ${
                                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                    {date.getDate()}
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                {dayTasks.length === 0 ? (
                                    <div className="text-sm text-gray-400 text-center">
                                        No Tasks
                                    </div>
                                ) : (
                                    dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                            className="bg-gray-50 border rounded p-2 text-sm"
                                        >
                                            {task.title}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}