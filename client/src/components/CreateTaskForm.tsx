import { useState } from 'react';
import type {CreateTaskInput} from '../types/task';

interface CreateTaskFormProps {
    onSubmit: (data: CreateTaskInput) => void;
    isLoading?: boolean;
}

export function CreateTaskForm({ onSubmit, isLoading }: CreateTaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [timeEstimate, setTimeEstimate] = useState<number | undefined>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
            timeEstimate: timeEstimate || undefined,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setDueDate('');
        setTimeEstimate(undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Task</h2>

            <div className="space-y-4">
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
                        value={timeEstimate}
                        onChange={(e) => setTimeEstimate(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="e.g., 30"
                        min="5"
                        step="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? 'Adding...' : 'Add Task'}
                </button>
            </div>
        </form>
    );
}