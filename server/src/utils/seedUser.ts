import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ensureTempUser() {
    const userId = 'temp-user-id';

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                id: userId,
                email: 'temp@example.com',
                name: 'Temp User',
                password: 'temp', // We'll add proper auth later
            },
        });
        console.log('✅ Temporary user created');
    }
}