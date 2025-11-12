import type {Task} from "../types/task.ts";

interface WeekTaskCardProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onDragStart: (task: Task) => void;
}

export function WeekTaskCard({task, onToggleComplete, onDragStart}: WeekTaskCardProps) {
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div
            draggable
            onDragStart={() => onDragStart(task)}
            className={`border rounded p-2 text-sm cursor-move hover:shadow-md transition-shadow ${
                task.completed ? 'bg-gray-100 opacity-60' : 'bg-white'
            }`}
        >
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                    <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        {task.startTime && (
                            <span>{task.startTime}</span>
                        )}
                        {task.timeEstimate && (
                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                {formatTime(task.timeEstimate)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}