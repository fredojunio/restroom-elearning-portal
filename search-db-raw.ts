import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const slides = await prisma.slide.findMany({
        where: {
            OR: [
                { mascot: { contains: 'winning' } },
                { image: { contains: 'winning' } },
                { content: { contains: 'winning' } }
            ]
        }
    });
    console.log(`Found ${slides.length} slides containing 'winning'`);
    slides.forEach(s => {
        console.log(`ID: ${s.id}, LessonID: ${s.lessonId}, Order: ${s.order}, Mascot: ${s.mascot}, Image: ${s.image}`);
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());
