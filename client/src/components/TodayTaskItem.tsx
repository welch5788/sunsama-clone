import type {Task} from '../types/task';

interface TodayTaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onRemoveFromToday: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export function TodayTaskItem({task, onToggle, onRemoveFromToday, onDelete, onEdit}: TodayTaskItemProps) {
    return (
        <div
            className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-lg font-medium ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    )}
                    {task.dueDate && (
                        <p className="mt-1 text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                    )}
                    {task.timeEstimate && (
                        <p className="mt-1 text-xs text-blue-600 font-medium">
                            ⏱️ {task.timeEstimate} min
                        </p>
                    )}
                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={() => onEdit(task)}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onRemoveFromToday(task.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Remove from Today
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}