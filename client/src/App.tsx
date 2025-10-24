import {Tasks} from "./pages/Tasks.tsx";
import {useState} from "react";
import {Today} from "./pages/Today.tsx";

function App() {
    const [view, setView] = useState<'today' | 'tasks'>('today');
    return (
        <div>
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-8 h-16 items-center">
                        <button
                            onClick={() => setView('today')}
                            className={`px-3 py-2 font-medium ${
                                view === 'today'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            >
                            Today
                        </button>
                        <button
                            onClick={() => setView('tasks')}
                            className={`px-3 py-2 font-medium ${
                                view === 'tasks'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            >
                            All Tasks
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            {view === 'today' ? <Today/> : <Tasks/>}
        </div>
    )
}

export default App;