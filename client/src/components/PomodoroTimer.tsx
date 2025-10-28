import type {Task} from "../types/task.ts";
import {useEffect, useRef, useState} from "react";

interface PomodoroTimerProps {
    task: Task;
    onComplete: (taskId: string, minutesSpent: number) => void;
    onClose: () => void;
}

export function PomodoroTimer({task, onComplete, onClose}: PomodoroTimerProps) {
    const [timeLeft, setTimeLeft] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        const minutesSpent = Math.ceil((1500 - prev + totalTimeSpent) / 60);
                        onComplete(task.id, minutesSpent);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => {
        setIsRunning(false);
        setTotalTimeSpent(prev => prev + (1500 - timeLeft));
    };
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(1500);
        setTotalTimeSpent(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const progress = ((1500 - timeLeft) / 1500) * 100;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">Pomodoro Session</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-gray-900 mb-4">
                        {formatTime(timeLeft)}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    {!isRunning ? (
                        <button
                            onClick={handleStart}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
                        >
                            {timeLeft === 1500 ? 'Start' : 'Resume'}
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 font-medium"
                        >
                            Pause
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </button>
                </div>

                {/* Task Info */}
                {task.timeEstimate && (
                    <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-gray-600">
                            Estimated: {task.timeEstimate} min
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}