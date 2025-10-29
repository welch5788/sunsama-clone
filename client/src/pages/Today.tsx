import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {taskApi, type UpdateTaskInput} from "../api/tasks.ts";
import {DailyTimeSummary} from "../components/DailyTimeSummary.tsx";
import {useEffect, useRef, useState} from "react";
import type {Task} from "../types/task.ts";
import {EditTaskModal} from "../components/EditTaskModal.tsx";
import {Timeline} from "../components/Timeline.tsx";
import {DndContext, type DragEndEvent, useDroppable} from "@dnd-kit/core";
import {DraggableTaskItem} from "../components/DraggableTaskItem.tsx";
import {PomodoroTimer} from "../components/PomodoroTimer.tsx";

export function Today() {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [activeTimer, setActiveTimer] = useState<{
        task: Task;
        timeLeft: number;
        isRunning: boolean;
        totalTimeSpent: number;
    } | null>(null);
    const [showTimerModal, setShowTimerModal] = useState(false);

    const timerIntervalRef = useRef<number | null>(null);

    const queryClient = useQueryClient();

    // Fetch tasks
    const {data: tasks, isLoading, error} = useQuery({
        queryKey: ['tasks'],
        queryFn: taskApi.getTasks,
    });

    useEffect(() => {
        if (activeTimer && activeTimer.isRunning && activeTimer.timeLeft > 0) {
            timerIntervalRef.current = window.setInterval(() => {
                setActiveTimer(prev => {
                    if (!prev) return null;

                    const newTimeLeft = prev.timeLeft - 1;

                    if (newTimeLeft <= 0) {
                        const minutesSpent = Math.ceil((1500 + prev.totalTimeSpent) / 60);
                        handleTimerComplete(prev.task.id, minutesSpent);
                        return null;
                    }

                    return {
                        ...prev,
                        timeLeft: newTimeLeft
                    };
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        }
    }, [activeTimer?.isRunning, activeTimer?.timeLeft]);

    // Helper function to filter today's tasks
    const isToday = (dateString: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    // Plan task mutation
    const planMutation = useMutation({
        mutationFn: ({id, plannedDate}: {
            id: string;
            plannedDate: string | null
        }) => taskApi.planTask(id, plannedDate),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    // Toggle task mutation
    const toggleMutation = useMutation({
        mutationFn: taskApi.toggleTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    // Delete task mutation
    const deleteMutation = useMutation({
        mutationFn: taskApi.deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    // Update task mutation
    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: string; data: UpdateTaskInput }) => taskApi.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
            setEditingTask(null);
        },
    });

    const handleRemoveFromToday = (id: string) => {
        planMutation.mutate({id, plannedDate: null});
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
        updateMutation.mutate({id, data});
    }

    const handleUpdateStartTime = (id: string, startTime: string) => {
        updateMutation.mutate({id, data: {startTime}});
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over) return;

        const taskId = active.id.toString();
        const timeSlot = over.data?.current?.timeSlot;

        handleUpdateStartTime(taskId, timeSlot);

        console.log('Dragged task:', active.id);
        console.log('Dropped on:', over.data?.current);
    }

    const handleStartTimer = (task: Task) => {
        if (activeTimer && activeTimer.task.id === task.id) {
            setShowTimerModal(true);
            return;
        }

        setActiveTimer({
            task,
            timeLeft: 1500,
            isRunning: false,
            totalTimeSpent: 0,
        });
        setShowTimerModal(true);
    };

    const handleTimerUpdate = (timeLeft: number, isRunning: boolean, totalTimeSpent: number) => {
        if (activeTimer) {
            setActiveTimer({
                ...activeTimer,
                timeLeft,
                isRunning,
                totalTimeSpent,
            });
        }
    };

    const handleTimerComplete = (taskId: string, minutesSpent: number) => {
        updateMutation.mutate({
            id: taskId,
            data: {actualTime: (tasks?.find(t => t.id === taskId)?.actualTime || 0) + minutesSpent}
        });
        setActiveTimer(null);
        setShowTimerModal(false);
    };

    const handleCloseTimerModal = () => {
        setShowTimerModal(false);
    };

    const handleStopTimer = () => {
        if (activeTimer) {
            const timeSpent = 1500 - activeTimer.timeLeft + activeTimer.totalTimeSpent;

            if (timeSpent > 0) {
                const minutesSpent = Math.ceil(timeSpent / 60);
                updateMutation.mutate({
                    id: activeTimer.task.id,
                    data: {actualTime: (tasks?.find(t => t.id === activeTimer.task.id)?.actualTime || 0) + minutesSpent}
                });
            }
        }
        setActiveTimer(null);
        setShowTimerModal(false);
    };

    const todayTasks = tasks?.filter(task => isToday(task.plannedDate));

    function UnscheduledDropZone({children}: { children: React.ReactNode }) {
        const {setNodeRef, isOver} = useDroppable({
            id: 'unscheduled',
            data: {timeSlot: null}
        });

        return (
            <div
                ref={setNodeRef}
                className={`space-y-3 min-h-32 p-4 rounded-lg transition-colors ${
                    isOver ? "bg-gray-100 border-2 border-gray-400 border-dashed" : ""
                }`}
            >
                {children}
            </div>
        );
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Today</h1>
                <p className="text-gray-600 mb-8">
                    {todayTasks?.length || 0} tasks planned
                </p>
                {todayTasks && todayTasks.length > 0 && (
                    <DailyTimeSummary tasks={todayTasks}/>
                )}

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Unscheduled tasks */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Unscheduled Tasks</h2>
                        {isLoading && <p className="text-gray-500">Loading tasks...</p>}
                        {error && <p className="text-red-500">Failed to load tasks</p>}

                        <UnscheduledDropZone>
                            {todayTasks
                                ?.filter(task => !task.startTime)
                                ?.map((task) => (
                                    <DraggableTaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                        onRemoveFromToday={handleRemoveFromToday}
                                        onDelete={handleDeleteTask}
                                        onEdit={handleEdit}
                                    />
                                ))}

                            {todayTasks?.filter(t => !t.startTime).length === 0 && (
                                <p className="text-gray-500 text-sm">
                                    All tasks scheduled! 🎉
                                </p>
                            )}
                        </UnscheduledDropZone>
                    </div>

                    {/* Right: Timeline */}
                    <div>
                        <Timeline
                            tasks={todayTasks || []}
                            onStartTimer={handleStartTimer}
                        />
                    </div>
                </div>
                {activeTimer && !showTimerModal && (
                    <button
                        onClick={() => setShowTimerModal(true)}
                        className="fixed bottom-8 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-40"
                        title="Open timer"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🍅</span>
                            <div className="text-sm font-medium">
                                {Math.floor(activeTimer.timeLeft / 60)}:{(activeTimer.timeLeft % 60).toString().padStart(2, "0")}
                            </div>
                        </div>
                    </button>
                )}
                {editingTask && (<EditTaskModal
                    task={editingTask!}
                    isOpen={true}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveEdit}
                    isLoading={updateMutation.isPending}
                />)}
                {activeTimer && showTimerModal && (
                    <PomodoroTimer
                        task={activeTimer.task}
                        initialTimeLeft={activeTimer.timeLeft}
                        initialIsRunning={activeTimer.isRunning}
                        initialTotalTimeSpent={activeTimer.totalTimeSpent}
                        onUpdate={handleTimerUpdate}
                        onComplete={handleTimerComplete}
                        onClose={handleCloseTimerModal}
                        onStop={handleStopTimer}
                    />
                )}
            </div>
        </div>
        </DndContext>
    )
}
