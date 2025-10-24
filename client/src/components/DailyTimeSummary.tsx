import type {Task} from '../types/task';

interface DailyTimeSummaryProps {
    tasks: Task[];
}

export function DailyTimeSummary({tasks}: DailyTimeSummaryProps) {
    const totalMinutes = tasks.reduce((sum, task) => sum + (task.timeEstimate || 0), 0);

    const scheduledTasks = tasks.filter(task => task.startTime);
    const unscheduledTasks = tasks.filter(task => !task.startTime);

    const scheduledMinutes = scheduledTasks.reduce((sum, task) => sum + (task.timeEstimate || 0), 0);
    const unscheduledMinutes = unscheduledTasks.reduce((sum, task) => sum + (task.timeEstimate || 0), 0);

    const scheduledHours = Math.floor(scheduledMinutes / 60);
    const scheduledMins = scheduledMinutes % 60;

    const unscheduledHours = Math.floor(unscheduledMinutes / 60);
    const unscheduledMins = unscheduledMinutes % 60;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const tasksWithEstimates = tasks.filter(task => task.timeEstimate).length;
    const tasksWithoutEstimates = tasks.length - tasksWithEstimates;

    const formatTime = (hrs: number, mins: number) => {
        if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
        if (hrs > 0) return `${hrs}h`;
        return `${mins}m`;
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Daily Summary</h2>

            <div className="space-y-2 text-sm">
                {/* Total time */}
                <div className="flex justify-between">
                    <span className="text-gray-700">Total Time:</span>
                    <span className="font-semibold text-blue-900">
                        {hours > 0 || minutes > 0 ? formatTime(hours, minutes) : '0m'}
                    </span>
                </div>

                {/* Scheduled time */}
                <div className="flex justify-between">
                    <span className="text-gray-700">Scheduled:</span>
                    <span className="font-semibold text-green-700">
                        {scheduledMinutes > 0 ? formatTime(scheduledHours, scheduledMins) : '0m'}
                    </span>
                </div>

                {/* Unscheduled time */}
                <div className="flex justify-between">
                    <span className="text-gray-700">Unscheduled:</span>
                    <span className="font-semibold text-orange-600">
                        {unscheduledMinutes > 0 ? formatTime(unscheduledHours, unscheduledMins) : '0m'}
                    </span>
                </div>

                {/* Task counts */}
                <div className="flex justify-between">
                    <span className="text-gray-700">Tasks:</span>
                    <span className="font-semibold text-blue-900">
                        {tasks.length} tasks ({tasksWithEstimates} estimated, {tasksWithoutEstimates} not estimated)
                    </span>
                </div>

                {/* Day percentage */}
                <div className="flex justify-between">
                    <span className="text-gray-700">Day Planned:</span>
                    <span className="font-semibold text-blue-900">
                        {Math.round(totalMinutes / 480 * 100)}% of your day planned
                    </span>
                </div>
            </div>
        </div>
    );
}