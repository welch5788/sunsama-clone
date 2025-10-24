import {useEffect, useState} from 'react';

export function CurrentTimeIndicator() {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every 60 seconds

        return () => clearInterval(interval);
    }, []);

    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    // Only show if within timeline hours (8 AM to 6 PM)
    if (hour < 8 || hour >= 18) return null;

    // Calculate position as percentage
    // Each hour slot is equal height, so we calculate based on:
    // - Which hour we're in (0-9 for 8am-5pm)
    // - How many minutes into that hour (0-59)
    const hoursSinceStart = hour - 8;
    const minuteProgress = minutes / 60;
    const totalProgress = hoursSinceStart + minuteProgress;
    const percentageFromTop = (totalProgress / 10) * 100; // 10 total hours

    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{top: `${percentageFromTop}%`}}
        >
            <div className="flex items-center">
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-l font-medium">
          {timeString}
        </span>
                <div className="flex-1 h-0.5 bg-red-500"></div>
            </div>
        </div>
    );
}