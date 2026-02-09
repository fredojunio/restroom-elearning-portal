import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const slides = await prisma.slide.findMany({
        where: {
            lesson: {
                module: {
                    title: "Be a Toilet Hero Every Day"
                }
            }
        },
        orderBy: { order: 'asc' }
    });
    console.log("Slides in DB for Module 2:");
    slides.forEach(s => {
        console.log(`Order ${s.order}: ${s.title} (Mascot: ${s.mascot}, Image: ${s.image}, BG: ${s.background})`);
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());
