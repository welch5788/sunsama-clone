import {useEffect} from "react";
import {useTimerStore} from "../store/timerStore.ts";

interface PomodoroTimerProps {
    onClose: () => void,
    onComplete: (taskId: string, minutesSpent: number) => void,
}

export function PomodoroTimer({onClose, onComplete}: PomodoroTimerProps) {
    const {
        activeTask,
        timeLeft,
        isRunning,
        sessionJustCompleted,
        totalMinutesLogged,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetCurrentSession,
        stopAndClear,
        tick,
        acknowledgeCompletion,
        setIntervalId,
        intervalId,
    } = useTimerStore();

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const id = window.setInterval(() => {
                tick();
            }, 1000);

            setIntervalId(id);

            return () => {
                clearInterval(id);
                setIntervalId(null);
            };
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (sessionJustCompleted && activeTask) {
            onComplete(activeTask.id, 25);
            acknowledgeCompletion();
        }
    }, [sessionJustCompleted, activeTask]);

    if (!activeTask) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const progress = ((1500 - timeLeft) / 1500) * 100;

    const currentSessionMinutes = Math.ceil((1500 - timeLeft) / 60);

    const totalMinutesWorked = totalMinutesLogged + currentSessionMinutes;


    const handleStopAndSave = () => {
        if (currentSessionMinutes > 0 && activeTask) {
            onComplete(activeTask.id, currentSessionMinutes);
        } else {
            stopAndClear();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{activeTask.title}</h2>
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

                    {totalMinutesWorked > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            Total worked this session: {totalMinutesWorked} min
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="space-y-3">
                    <div className="flex gap-3">
                        {!isRunning ? (
                            <button
                                onClick={() => timeLeft === 1500 && totalMinutesLogged === 0 ? startTimer(activeTask) : resumeTimer()}
                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
                            >
                                {timeLeft === 1500 && totalMinutesLogged === 0 ? 'Start' : 'Resume'}
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 font-medium"
                            >
                                Pause
                            </button>
                        )}
                        <button
                            onClick={resetCurrentSession}
                            className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Reset
                        </button>
                    </div>

                    {currentSessionMinutes > 0 && (
                        <button
                            onClick={handleStopAndSave}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
                        >
                            Stop & Save Progress
                        </button>
                    )}
                </div>
                {/* Task Info */}
                {activeTask.timeEstimate && (
                    <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-gray-600">
                            Estimated: {activeTask.timeEstimate} min
                        </p>
                        {activeTask.actualTime && (
                            <p className="text-sm text-gray-600">
                                Previously logged: {activeTask.actualTime} min
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}