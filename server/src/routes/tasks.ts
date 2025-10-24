import {Router} from 'express';
import {PrismaClient} from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all tasks for a user
router.get('/', async (req, res) => {
    try {
        // For now, we'll use a hardcoded userId (we'll add auth later)
        const userId = 'temp-user-id';

        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, timeEstimate } = req.body;
        const userId = 'temp-user-id';

        const task = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                timeEstimate,
                userId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Toggle task completion
router.patch('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { completed: !task.completed },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Plan a task for a specific date
router.patch('/:id/plan', async (req, res) => {
    try {
        const { id } = req.params;
        let { plannedDate } = req.body;

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { plannedDate: plannedDate ? new Date(plannedDate) : null },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update planned date for task' });
    }
});

// Update a task
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let {title, description, dueDate, timeEstimate, startTime} = req.body;

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                timeEstimate,
                startTime
            },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

export default router;