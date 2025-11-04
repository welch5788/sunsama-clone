import {Tasks} from "./pages/Tasks.tsx";
import {useState} from "react";
import {Today} from "./pages/Today.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {taskApi} from "./api/tasks.ts";
import type {CreateTaskInput} from "./types/task.ts";
import {useKeyboardShortcut} from "./hooks/useKeyboardShortcut.ts";
import {CreateTaskModal} from "./components/CreateTaskModal.tsx";
import {SettingsModal} from "./components/SettingsModal.tsx";
import {Week} from "./pages/Week.tsx";

function App() {
    const [view, setView] = useState<'today' | 'tasks' | 'week'>('today');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: taskApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        }
    });

    const handleCreateTask = (data: CreateTaskInput) => {
        createMutation.mutate(data);
    };

    useKeyboardShortcut('n', () => setShowCreateModal(true));
    useKeyboardShortcut('t', () => setView('today'));
    useKeyboardShortcut('a', () => setView('tasks'));
    useKeyboardShortcut('w', () => setView('week'));
    useKeyboardShortcut('Escape', () => {
        setShowCreateModal(false);
        setShowSettingsModal(false);
    });

    return (
        <div>
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setView('today')}
                                className={`px-3 py-2 font-medium ${
                                    view === 'today'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Today <kbd className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">T</kbd>
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-3 py-2 font-medium ${
                                    view === 'week'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Week <kbd className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">W</kbd>
                            </button>
                            <button
                                onClick={() => setView('tasks')}
                                className={`px-3 py-2 font-medium ${
                                    view === 'tasks'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                All Tasks <kbd className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">A</kbd>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover: bg-gray-100"
                                title="Settings"
                            >
                                ⚙️
                            </button>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                            >
                                New Task <kbd className="ml-2 text-xs bg-blue-500 px-1.5 py-0.5 rounded">N</kbd>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            {view === 'today' ? <Today/> : view === 'tasks' ? <Tasks/> : <Week/>}

            {/* Modals */}
            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTask}
                isLoading={createMutation.isPending}
            />

            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}/>
        </div>
    );
}

export default App;