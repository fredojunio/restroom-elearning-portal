import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const modules = await prisma.module.findMany({
        include: {
            lessons: {
                include: {
                    slides: true
                }
            }
        }
    });
    console.log("Database Content Overview:");
    modules.forEach(m => {
        console.log(`\nModule: ${m.title} (ID: ${m.id})`);
        m.lessons.forEach(l => {
            console.log(`  Lesson: ${l.title} (ID: ${l.id})`);
            l.slides.sort((a, b) => a.order - b.order).forEach(s => {
                if (s.mascot?.includes('winning') || s.image?.includes('winning')) {
                    console.log(`    !!! FOUND mascot-winning in Slide ${s.order}: ${s.title} !!!`);
                }
                console.log(`    Order ${s.order}: ${s.title} (Mascot: ${s.mascot}, Image: ${s.image})`);
            });
        });
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());
