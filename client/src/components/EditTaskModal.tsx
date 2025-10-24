import { useState } from 'react';
import type { Task } from '../types/task';
import type { UpdateTaskInput } from '../api/tasks';

interface EditTaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: UpdateTaskInput) => void;
    isLoading?: boolean;
}

export function EditTaskModal({ task, isOpen, onClose, onSave, isLoading }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title ? task.title : '' );
    const [description, setDescription] = useState(task.description ? task.description : '');
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [timeEstimate, setTimeEstimate] = useState(task.timeEstimate ? task.timeEstimate : undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(task.id,{
                title,
                description: description || undefined,
                dueDate: dueDate || undefined,
                timeEstimate: timeEstimate || undefined,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        // Dark overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal box */}
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Task</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What do you need to do?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-700 mb-1">
                            Time Estimate
                        </label>
                        <input
                            type="number"
                            id="timeEstimate"
                            value={timeEstimate || ''}
                            onChange={(e) => setTimeEstimate(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="e.g., 30"
                            min="5"
                            step="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}