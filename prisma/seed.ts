// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up database...");
  // Delete in reverse order of dependencies
  await prisma.completion.deleteMany({});
  await prisma.studentModule.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.slide.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  // We keep users to avoid session issues, but we can upsert them

  // ===== 2. Create Users (Teacher & Students) =====
  console.log("\n👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@school.edu" },
    update: { password: hashedPassword },
    create: {
      email: "teacher@school.edu",
      password: hashedPassword,
      name: "John Smith",
      role: "TEACHER",
    },
  });
  console.log(`✓ Teacher created: ${teacher.name}`);

  const student1 = await prisma.user.upsert({
    where: { email: "alice@school.edu" },
    update: { password: hashedPassword },
    create: {
      email: "alice@school.edu",
      password: hashedPassword,
      name: "Alice Johnson",
      role: "STUDENT",
    },
  });
  console.log(`✓ Student created: ${student1.name}`);

  // ===== 3. Create Module 1 =====
  console.log("\n📚 Creating Module 1...");
  const module1 = await prisma.module.create({
    data: {
      title: "Clean Toilets Keep Us Healthy",
      description: "Module A: Introduction to Hygiene",
      grade: 3,
      subject: "Hygiene",
      content: "Learn the basics of restroom hygiene and why it matters.",
      lessons: {
        create: {
          title: "Classroom Session",
          order: 1,
          slides: {
            create: [
              {
                order: 1,
                type: "video",
                title: "Mission Introduction",
                videoUrl: "/videos/module-a/A1 video.mp4",
                waitSeconds: 3,
                audio: "/audio/intro-speech.mp3"
              },
              {
                order: 2,
                type: "title",
                title: "Welcome to Toilet Heroes",
                subtitle: "Clean Toilets Keep Us Healthy",
                content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
                waitSeconds: 3
              },
              {
                order: 3,
                type: "content",
                title: "Hi there, Hero",
                content: "Welcome back heroes! I'm so glad you're here for our next lesson. Today we're going to talk about something very important—our school toilets. You see, our toilets are shared spaces. That means many of our friends use them every single day. To keep everyone healthy and happy, we all have a special part to play. It's like a team mission. By the end of this class, you'll know exactly how to be a toilet hygiene hero for your school. Are you ready? Let's jump into our mission!",
                mascot: "/mascots/mascot-greeting.png",
                waitSeconds: 3,
                audio: "/audio/hi-there-hero.mp3"
              },
              {
                order: 4,
                type: "content",
                title: "Meet the Invisible Germs",
                content: "• Invisible\n• Love wet spots\n• Live on faucets\n• Use hygiene",
                mascot: "/mascots/mascot-pointing.png",
                background: "/images/meet-invisible-germs.png",
                audio: "/audio/meet-invisible-germs.mp3"
              },
              {
                order: 5,
                type: "video",
                title: "Germ Secret Revealed",
                videoUrl: "/videos/module-a/A2.mp4",
                waitSeconds: 3
              },
              {
                order: 6,
                type: "game",
                title: "Germ Hunter Game",
                gameType: "Drag to Disinfect",
                content: "Drag all invisible germs into the 'Sanitizer' portal to clear the restroom!",
                background: "/videos/module-a/A7.mov",
              },
              {
                order: 7,
                type: "image",
                title: "How Germs Travel",
                image: "🦠",
                content: "Germs often gather on door handles and light switches. Look closely!",
                mascot: "/mascots/mascot-pointing.png",
                audio: "/audio/how-germs-travel.mp3",
                background: "/videos/module-a/A4-1.mov"
              },
              {
                id: "slide-a4-video",
                type: "video",
                title: "How Germs Travel",
                videoUrl: "/videos/module-a/A4.mp4",
                order: 8,
                waitSeconds: 3
              },
              {
                id: "slide-a5-video",
                type: "video",
                title: "Wash Your Hand!",
                videoUrl: "/videos/module-a/A5.mp4",
                order: 9,
                waitSeconds: 3
              },
              {
                id: "slide-a6-video",
                type: "video",
                title: "Wash Your Hand!",
                videoUrl: "/videos/module-a/A6.mp4",
                order: 10,
                waitSeconds: 3
              },
              {
                order: 11,
                type: "game",
                title: "Tiny Germs, Big Impact",
                gameType: "Story Interaction",
                content: "Spot the animated germ moving from the toilet to the hand? Quickly tap to scrub it away, then press the 'Wash' button to clean the hands and stop the germ from reaching the face!",
                mascot: "/mascots/mascot-scared.png",
                background: "/videos/module-a/A11.mov"
              },
              {
                order: 12,
                type: "comparison",
                title: "Clean Toilets, Happy Friends",
              },
              {
                id: "slide-a8-video",
                type: "video",
                title: "Clean Toilets, Happy Friends",
                videoUrl: "/videos/module-a/A8.mp4",
                order: 13,
                waitSeconds: 3
              },
              {
                id: "slide-a9-video",
                type: "video",
                title: "Fun Quiz Time!",
                videoUrl: "/videos/module-a/A9.mp4",
                audio: "/audio/fun-quiz-time.mp3",
                order: 14,
                waitSeconds: 3
              },
              {
                order: 15,
                type: "quiz",
                title: "Fun Quiz Time!",
                content: "Drag and drop the correct answers into the boxes to complete the quiz!",
                questions: [
                  {
                    id: "q1",
                    type: "DRAG_AND_DROP",
                    question: "True or False?",
                    description: "Germs are so small we cannot see them. Is this true?",
                    options: ["TRUE!", "FALSE!"],
                    correctAnswer: "TRUE!"
                  },
                  {
                    id: "q2",
                    type: "DRAG_AND_DROP",
                    question: "The Best Cleaner",
                    description: "What removes germs best from our soapy hands?",
                    options: ["Soap + Water!", "Wiping on clothes!"],
                    correctAnswer: "Soap + Water!"
                  }
                ],
              }
              ,
              {
                order: 16,
                type: "celebration",
                title: "What a Toilet Hero!",
                content: "Students receive praise from the mascot and a 'Health Defender' badge.\n\nThis creates a sense of achievement and motivates them to continue to Module B.",
                mascot: "/mascots/mascot-hero.png",
                background: "/images/celebration-bg.jpg",
                waitSeconds: 3
              }
            ]
          }
        }
      }
    },
  });
  console.log(`✓ Module 1 created with ${9} slides`);

  // ===== 4. Create Module 2 =====
  console.log("\n📚 Creating Module 2...");
  const module2 = await prisma.module.create({
    data: {
      title: "Be a Toilet Hero Every Day",
      description: "Module B: Habits, Respect & Responsibility",
      grade: 3,
      subject: "Hygiene",
      content: "Learn the habits that make you a true Toilet Hero.",
      lessons: {
        create: {
          title: "Habit Session",
          order: 1,
          slides: {
            create: [
              {
                id: "slide-b1-video",
                type: "video",
                title: "Be a Toilet Hero Every Day!",
                videoUrl: "/videos/module-b/B1.mp4",
                order: 1,
                waitSeconds: 2
              },
              {
                order: 2,
                type: "title",
                title: "Be a Toilet Hero Every Day",
                subtitle: "Module B: Habits, Respect & Responsibility",
                content: "Format: Learn Through Play",
                background: "/backgrounds/module-2-bg.jpg",
                waitSeconds: 3
              },
              {
                order: 3,
                type: "content",
                title: "Ready to Help?",
                subtitle: "Section 1: Hello Again!",
                content: "Welcome back hero! Now that we know about germs, let's learn how you can help keep our school toilets clean and sparkling. Are you ready to help?",
                mascot: "/mascots/mascot-greeting.png",
                background: "/backgrounds/module-2-bg.jpg",
                waitSeconds: 3,
                audio: "/audio/ready-to-help.mp3"
              },
              {
                id: "slide-b2-video",
                type: "video",
                title: "Toilets are for everyone",
                content: "Toilets are for everyone. When we leave them clean, we are being kind to the next person.\n\n• Clean Choice: The next person (friend or teacher) smiles!\n• Messy Choice: The next person looks very unhappy.",
                videoUrl: "/videos/module-b/B2.mp4",
                order: 4,
                waitSeconds: 3
              },
              {
                id: "slide-b3-video",
                type: "video",
                title: "Toilets are for everyone",
                videoUrl: "/videos/module-b/B3.mp4",
                order: 5,
                waitSeconds: 3
              },
              {
                id: "slide-b8-video",
                type: "video",
                title: "Hero or Oops?",
                videoUrl: "/videos/module-b/B8.mp4",
                order: 6,
                waitSeconds: 3
              },
              {
                order: 7,
                type: "comparison",
                title: "Toilet Sharing",
                subtitle: "Section 2: Shared Spaces",
                content: "We take turns and share the clean toilet!",
                image: "clean_messy_comparison.png",
                background: "/backgrounds/m2-sharing-bg.jpg",
                invertChoices: true,
              },
              {
                order: 8,
                type: "video",
                title: "Always flush after use",
                videoUrl: "/videos/module-b/B5.mp4",
                waitSeconds: 3
              },
              {
                order: 9,
                type: "video",
                title: "Put tissues in the bin",
                videoUrl: "/videos/module-b/B6.mp4",
                waitSeconds: 3
              },
              {
                order: 10,
                type: "video",
                title: "Keep the floor dry",
                videoUrl: "/videos/module-b/B7.mp4",
                waitSeconds: 3
              },
              {
                id: "slide-b4-video",
                type: "video",
                title: "Hero or Oops?",
                videoUrl: "/videos/module-b/B4.mp4",
                order: 11,
                waitSeconds: 3
              },
              {
                order: 12,
                type: "game",
                title: "Toilet Hero Behavior Game",
                subtitle: "Section 3: Hero or Oops?",
                gameType: "HeroOrOops",
                content: "Hero or Oops?\nLook at the scenario and decide if it's a 'Toilet Hero' choice or an 'Oops' choice!",
                invertChoices: true,
                background: "/videos/module-b/B9.mp4",
              },
              {
                order: 13,
                type: "content",
                title: "Help our Heroes!",
                subtitle: "Section 4: Our Cleaners",
                content: "Our school cleaners work very hard every day to keep us safe. When we flush and keep things tidy, we make their job much easier. Let's help our heroes by doing our part.",
                mascot: "/mascots/mascot-pointing.png",
                waitSeconds: 3,
                background: "/images/help-bg.png",
                audio: "/audio/help-our-heroes.mp3"
              },
              {
                id: "slide-b14-video",
                type: "video",
                title: "Clean Up",
                videoUrl: "/videos/module-b/B14.mp4",
                order: 14,
                waitSeconds: 3,
                background: "/images/help-bg.png",
              },
              {
                id: "slide-b15-video",
                type: "video",
                title: "Clean Up",
                videoUrl: "/videos/module-b/B15.mp4",
                order: 15,
                waitSeconds: 3,
                background: "/images/help-bg.png",
              },
              {
                id: "slide-b16-video",
                type: "video",
                title: "Clean Up",
                videoUrl: "/videos/module-b/B16.mp4",
                order: 16,
                waitSeconds: 3,
                background: "/images/help-bg.png",
              },
              {
                order: 17,
                type: "game",
                title: "Clean-Up Challenge",
                subtitle: "Game: Clean-Up Challenge",
                gameType: "CleanupChallenge",
                content: "Small Mess, Big Help\nInteractive 'Spot the Mess' game. Tapping the correct action fixes the scene:\n\n• Tissue on floor → Tap Bin\n• Water spill → Tap Wipe\n• Unflushed toilet → Tap Flush",
                background: "/backgrounds/cleanup-challenge-bg.jpg",
              },
              {
                id: "slide-b12-video",
                type: "video",
                title: "We Help The Cleaners!",
                videoUrl: "/videos/module-b/B12.mp4",
                order: 18,
                waitSeconds: 3
              },
              {
                order: 19,
                type: "celebration",
                title: "The Toilet Hero Pledge",
                subtitle: "I Promise To...",
                content: "• Use toilets properly\n• Keep toilets clean\n• Wash my hands\n• Be kind to cleaners",
                waitSeconds: 3
              },
              {
                id: "slide-b17-video",
                type: "video",
                title: "Toilet Hero Pledge",
                videoUrl: "/videos/module-b/B17.mp4",
                order: 20,
                waitSeconds: 3
              },
              {
                order: 21,
                type: "quiz",
                title: "Quick Hero Quiz!",
                content: "Drag and drop the correct answers into the boxes to complete the quiz!",
                questions: [
                  {
                    id: "m2-q1",
                    type: "DRAG_AND_DROP",
                    question: "What should you do after using the toilet?",
                    options: ["Flush properly!", "Leave it for later."],
                    correctAnswer: "Flush properly!"
                  },
                  {
                    id: "m2-q2",
                    type: "DRAG_AND_DROP",
                    question: "True or False: Toilets are shared spaces.",
                    options: ["TRUE!", "FALSE!"],
                    correctAnswer: "TRUE!"
                  },
                  {
                    id: "m2-q3",
                    type: "DRAG_AND_DROP",
                    question: "Who helps keep toilets clean?",
                    options: ["Everyone!", "Only the cleaners."],
                    correctAnswer: "Everyone!"
                  },
                  {
                    id: "m2-q4",
                    type: "DRAG_AND_DROP",
                    question: "Does a Toilet Hero help others?",
                    options: ["Yes, of course!", "No, just themselves."],
                    correctAnswer: "Yes, of course!"
                  }
                ],
              },
              {
                order: 22,
                type: "celebration",
                title: "Great Job!",
                subtitle: "You Are Now An Official Toilet Hero!",
                content: "Thank you for making Singapore's toilets clean and happy for everyone.\n\nYou have earned your Module B Certificate!",
                mascot: "/mascots/m2-mascot-final.png",
                image: "/mascots/m2-badge-final.png",
                background: "/backgrounds/module-2-final-bg.png",
                waitSeconds: 3
              }
            ]
          }
        }
      }
    },
  });
  console.log(`✓ Module 2 created with ${11} slides`);

  console.log("\n✨ Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
