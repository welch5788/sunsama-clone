import type {Task} from "../types/task.ts";
import {create} from "zustand/react";

interface TimerState {
    activeTask: Task | null;
    timeLeft: number;
    isRunning: boolean;
    sessionJustCompleted: boolean;
    totalMinutesLogged: number;
    intervalId: number | null;

    setActiveTask: (task: Task) => void;
    startTimer: (task: Task) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    resetCurrentSession: () => void;
    stopAndClear: () => void;
    tick: () => void;
    acknowledgeCompletion: () => void;
    setIntervalId: (id: number | null) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
    activeTask: null,
    timeLeft: 1500,
    isRunning: false,
    sessionJustCompleted: false,
    totalMinutesLogged: 0,
    intervalId: null,

    setActiveTask: (task: Task) => {
        const state = get();
        if (!state.activeTask || state.activeTask.id !== task.id) {
            set({
                activeTask: task,
                timeLeft: 1500,
                isRunning: false,
                totalMinutesLogged: 0,
                sessionJustCompleted: false,
            });
        }
    },
    startTimer: (task) => {
        const state = get();

        if (!state.activeTask || state.activeTask.id !== task.id) {
            set({
                activeTask: task,
                timeLeft: 1500,
                isRunning: true,
                totalMinutesLogged: 0,
                sessionJustCompleted: false,
            });
        } else {
            set({isRunning: true});
        }
    },

    pauseTimer: () => {
        set({isRunning: false});
    },

    resumeTimer: () => {
        set({isRunning: true});
    },

    resetCurrentSession: () => {
        set({
            timeLeft: 1500,
            isRunning: false,
        });
    },

    stopAndClear: () => {
        set({
            activeTask: null,
            timeLeft: 1500,
            isRunning: false,
            totalMinutesLogged: 0,
            sessionJustCompleted: false,
            intervalId: null,
        });
    },

    tick: () => {
        const state = get();

        if (state.timeLeft > 1) {
            set({timeLeft: state.timeLeft - 1})
        } else if (state.timeLeft === 1) {
            set({
                timeLeft: 0,
                isRunning: false,
                sessionJustCompleted: true,
                totalMinutesLogged: state.totalMinutesLogged + 25,
            });
        }
    },

    acknowledgeCompletion: () => {
        set({
            sessionJustCompleted: false,
            timeLeft: 1500,
        });
    },

    setIntervalId: (id) => {
        set({intervalId: id});
    },
}));