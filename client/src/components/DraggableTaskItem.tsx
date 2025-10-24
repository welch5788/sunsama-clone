import type {Task} from '../types/task';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableTaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onRemoveFromToday: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export function DraggableTaskItem({
                                      task,
                                      onToggle,
                                      onRemoveFromToday,
                                      onDelete,
                                      onEdit
                                  }: DraggableTaskItemProps) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: task.id,
        data: {task}
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
        >
            <div className="flex items-start gap-3">
                <div
                    {...listeners}
                    {...attributes}
                    className="cursor-move hover:bg-gray-100 p-1 rounded"
                    title="Drag to schedule"
                >
                    <svg className='w-5 h-5 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>
                    </svg>
                </div>

                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                        {task.timeEstimate && (
                            <span className="text-blue-600 font-medium">⏱️ {task.timeEstimate} min</span>
                        )}
                    </div>

                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(task);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromToday(task.id);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Remove from Today
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task.id);
                            }}
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