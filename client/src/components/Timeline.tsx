import type {Task} from '../types/task';
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {CurrentTimeIndicator} from "./CurrentTimeIndicator.tsx";


// Check if two tasks overlap in time
function tasksOverlap(task1: Task, task2: Task): boolean {
    if (!task1.startTime || !task2.startTime || !task1.timeEstimate || !task2.timeEstimate) {
        return false;
    }

    const [h1, m1] = task1.startTime.split(':').map(Number);
    const start1 = h1 * 60 + m1;
    const end1 = start1 + task1.timeEstimate;

    const [h2, m2] = task2.startTime.split(':').map(Number);
    const start2 = h2 * 60 + m2;
    const end2 = start2 + task2.timeEstimate;

    // Check if they overlap
    return start1 < end2 && start2 < end1;
}

// Get all tasks that overlap with a given task
function getOverlappingTasks(task: Task, allTasks: Task[]): Task[] {
    return allTasks.filter(t => t.id !== task.id && tasksOverlap(task, t));
}



interface TimelineProps {
    tasks: Task[];
    onUpdateTask: (id: string, startTime: string) => void;
}

function getTaskSpan(task: Task) {
    if (!task.startTime || !task.timeEstimate) return null;

    const [hourStr, minuteStr] = task.startTime.split(":");
    const startHour = parseInt(hourStr);
    const startMinute = parseInt(minuteStr);

    const totalMinutes = task.timeEstimate;
    const endTotalMinutes = startMinute + totalMinutes;
    const hoursSpanned = Math.ceil(endTotalMinutes / 60);

    return {
        startHour,
        startMinute,
        hoursSpanned,
        totalMinutes
    };
}

function ScheduledTask({task, isOverlapping}: { task: Task, isOverlapping: boolean }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: task.id,
        data: {task},
    });

    const span = getTaskSpan(task);
    if (!span) return null;

    const {startHour, startMinute, totalMinutes} = span;
    const hoursSinceStart = startHour - 8;
    const hourHeight = 64;

    const topPosition = (hoursSinceStart * hourHeight) + (startMinute / 60 * hourHeight);

    // Smaller minimum for tiny tasks
    // Scale naturally but with a floor based on actual duration
    const calculatedHeight = (totalMinutes / 60) * hourHeight;
    const height = totalMinutes <= 15 ? Math.max(calculatedHeight, 28) : Math.max(calculatedHeight, 40);

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const isTiny = height < 45; // Adjusted threshold
    // const isSmall = height < 90;

    return (
        <div
            className="absolute"
            style={{
                top: `${topPosition}px`,
                left: '96px',
                right: '24px',
                height: `${height}px`,
                zIndex: isDragging ? 50 : 10,
            }}
        >
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`h-full bg-blue-100 border-2 border-blue-400 rounded-lg cursor-move hover:shadow-lg transition-shadow overflow-hidden ${
                    isTiny ? 'p-1 flex items-center' : 'p-2'
                } ${
                    isOverlapping
                        ? 'bg-orange-100 border-2 border-orange-500'
                        : 'bg-blue-100 border-2 border-blue-400'
                }`}
            >
                <div className="w-full min-w-0">
                    <div className={`font-medium truncate ${isTiny ? 'text-xs' : 'text-sm'}`}>
                        {isOverlapping && '⚠️ '}
                        {task.title}
                    </div>
                    {!isTiny && task.timeEstimate && (
                        <div className="text-xs text-gray-600 mt-0.5">
                            ⏱️ {task.timeEstimate} min
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TimeSlot({
                      hour
                  }: {
    hour: number;
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
        <div className="flex gap-4 h-16 border-b border-gray-100">
            {/* Time label*/}
            <div className="w-20 flex-shrink-0 text-sm text-gray-500 pt-1">
                {formatHour(hour)}
            </div>

            {/* Droppable area */}
            <div
                ref={setNodeRef}
                className={`flex-1 rounded transition-colors ${
                    isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
                }`}
            />
        </div>
    );
}

export function Timeline({tasks}: TimelineProps) {
    // Define work hours (8am to 6pm)
    const hours = Array.from({length: 10}, (_, i) => i + 8); // [8, 9, 10, ..., 17]
    const scheduledTasks = tasks.filter(task => task.startTime);
    const totalHeight = hours.length * 64; // 10 hours * 64px

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>

            <div className="relative" style={{height: `${totalHeight}px`}}>
                <CurrentTimeIndicator/>

                <div className="relative z-0">
                    {hours.map(hour => (
                        <TimeSlot key={hour} hour={hour}/>
                    ))}
                </div>

                {/* Task overlays */}
                <div className="absolute top-0 left-0 right-0 z-10" style={{height: `${totalHeight}px`}}>
                    {scheduledTasks.map(task => {
                        const overlappingTasks = getOverlappingTasks(task, scheduledTasks);
                        const isOverlapping = overlappingTasks.length > 0;

                        return (
                            <ScheduledTask
                                key={task.id}
                                task={task}
                                isOverlapping={isOverlapping}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}