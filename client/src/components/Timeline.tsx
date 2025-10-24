import type {Task} from '../types/task';
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {CurrentTimeIndicator} from "./CurrentTimeIndicator.tsx";

interface TimelineProps {
    tasks: Task[];
    onUpdateTask: (id: string, startTime: string) => void;
}

function ScheduledTask({task}: { task: Task }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: task.id,
        data: task,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-blue-100 border border-blue-300 rounded p-2 mb-2 cursor-move hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div className="font-medium text-sm">{task.title}</div>
                {task.timeEstimate && (
                    <div className="text-xs text-gray-600">⏱️ {task.timeEstimate} min </div>
                )}
            </div>
        </div>
    );
}

function TimeSlot({
                      hour,
                      tasks
                  }: {
    hour: number;
    tasks: Task[];
}) {
    const hourStr = hour.toString().padStart(2, "0") + ':00';
    const {setNodeRef, isOver} = useDroppable({
        id: `timeslot-${hourStr}`,
        data: {hour, timeSlot: hourStr}
    });

    // Helper: Convert hour to display format
    const formatHour = (hour: number) => {
        if (hour === 12) return '12 PM';
        if (hour === 0) return '12 AM';
        return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    };

    return (
        <div className="flex gap-4 min-h-16 border-b border-gray-100">
            {/* Time label*/}
            <div className="w-20 flex-shrink-0 text-sm text-gray-500 pt-1">
                {formatHour(hour)}
            </div>

            {/* Droppable area */}
            <div
                ref={setNodeRef}
                className={`flex-1 py-2 rounded transition-colors ${
                    isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
                }`}
            >
                {tasks.map((task: Task) => (
                    <ScheduledTask key={task.id} task={task}/>
                ))}

                {tasks.length === 0 && (
                    <div className="h-12 flex items-center text-xs text-gray-400">
                        Drop task here
                    </div>
                )}
            </div>
        </div>
    );
}

export function Timeline({tasks}: TimelineProps) {
    // Define work hours (8am to 6pm)
    const hours = Array.from({length: 10}, (_, i) => i + 8); // [8, 9, 10, ..., 17]

    // Helper: Get tasks for a specific hour
    const getTasksForHour = (hour: number) => {
        return tasks.filter(task => {
            if (!task.startTime) return false;
            const taskHour = parseInt(task.startTime.split(':')[0]);
            return taskHour === hour;
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>

            <div className="relative">
                <CurrentTimeIndicator/>

                <div className="space-y-1">
                    {hours.map(hour => (
                        <TimeSlot
                            key={hour}
                            hour={hour}
                            tasks={getTasksForHour(hour)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}