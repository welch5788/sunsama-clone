import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import taskRoutes from './routes/tasks';
import { ensureTempUser } from './utils/seedUser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize temp user on startup
ensureTempUser().catch(console.error);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const taskCount = await prisma.task.count();
        res.json({
            success: true,
            database: 'connected',
            users: userCount,
            tasks: taskCount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});