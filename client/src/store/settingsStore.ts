import {create} from "zustand/react";
import {persist} from "zustand/middleware";

interface SettingsState {
    startHour: number;
    endHour: number;
    setStartHour: (hour: number) => void;
    setEndHour: (hour: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            startHour: 8,
            endHour: 18,
            setStartHour: (hour) => set({startHour: hour}),
            setEndHour: (hour) => set({endHour: hour}),
        }),
        {
            name: 'timeline-settings',
        }
    )
);