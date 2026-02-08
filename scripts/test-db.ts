import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    const moduleIds = [
        "cmksky99d0004xqpwzlm9c7nf", // Failing one
        "cmksky9980003xqpwhvvdhnyh"  // Working one
    ];

    for (const moduleId of moduleIds) {
        console.log(`\n--- Testing Module: ${moduleId} ---`);
        try {
            const start = Date.now();
            const lessons = await prisma.lesson.findMany({
                where: { moduleId },
            });
            console.log(`Success! Found ${lessons.length} lessons in ${Date.now() - start}ms`);
        } catch (error) {
            console.error(`Error for module ${moduleId}:`, error);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
