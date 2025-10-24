import {useSettingsStore} from "../store/settingsStore.ts";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({isOpen, onClose}: SettingsModalProps) {
    const {startHour, endHour, setStartHour, setEndHour} = useSettingsStore();

    if (!isOpen) return null;

    const startHourOptions = Array.from({length: 7}, (_, i) => i + 6);
    const endHourOptions = Array.from({length: 8}, (_, i) => i + 15);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Hour
                        </label>
                        <select
                            value={startHour}
                            onChange={(e) => setStartHour(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {startHourOptions.map(hour => (
                                <option key={hour} value={hour}>
                                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            When does your work day start?
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Hour
                        </label>
                        <select
                            value={endHour}
                            onChange={(e) => setEndHour(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {endHourOptions.map(hour => (
                                <option key={hour} value={hour}>
                                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            When does your work day end?
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                            Timeline will show <strong>{endHour - startHour} hours</strong> from{' '}
                            <strong>
                                {startHour === 12 ? '12 PM' : startHour > 12 ? `${startHour - 12} PM` : `${startHour} AM`}
                            </strong>{' '}
                            to{' '}
                            <strong>
                                {endHour === 12 ? '12 PM' : endHour > 12 ? `${endHour - 12} PM` : `${endHour} AM`}
                            </strong>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}