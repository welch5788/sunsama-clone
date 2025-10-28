export interface Task {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    dueDate: string | null;
    plannedDate: string | null;
    startTime: string | null;
    timeEstimate: number | null;
    actualTime: number | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    dueDate?: string;
    plannedDate?: string;
    timeEstimate?: number;
    startTime?: string;
}