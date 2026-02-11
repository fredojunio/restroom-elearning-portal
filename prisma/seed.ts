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
                type: "title",
                title: "Welcome to Toilet Heroes",
                subtitle: "Clean Toilets Keep Us Healthy",
                content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
              },
              {
                order: 2,
                type: "content",
                title: "Hi there, Hero",
                content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
                mascot: "/mascots/mascot-greeting.png"
              },
              {
                order: 3,
                type: "content",
                title: "Meet the Invisible Germs",
                content: "• Germs are invisible but real\n• They love wet surfaces\n• They can live on faucet handles for hours\n• But we have a secret weapon: Hygiene!",
                mascot: "/mascots/mascot-pointing.png"
              },
              {
                order: 4,
                type: "game",
                title: "Germ Hunter Game",
                gameType: "Drag to Disinfect",
                content: "Drag all 6 invisible germs into the 'Sanitizer' portal to clear the restroom!",
              },
              {
                order: 5,
                type: "image",
                title: "How Germs Travel",
                image: "🦠",
                content: "Germs often gather on door handles and light switches. Look closely!",
                mascot: "/mascots/mascot-pointing.png"
              },
              {
                order: 6,
                type: "game",
                title: "Tiny Germs, Big Impact",
                gameType: "Story Interaction",
                content: "Spot the animated germ moving from the toilet to the hand? Quickly tap to scrub it away, then press the 'Wash' button to clean the hands and stop the germ from reaching the face!",
                mascot: "/mascots/mascot-scared.png"
              },
              {
                order: 7,
                type: "comparison",
                title: "Clean Toilets, Happy Friends",
              },
              {
                order: 8,
                type: "quiz",
                title: "Fun Quiz Time!",
                content: "Prove you're a Toilet Hero by passing this quick check!",
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
                ]
              },
              {
                order: 9,
                type: "celebration",
                title: "What a Toilet Hero!",
                content: "Students receive praise from the mascot and a 'Health Defender' badge.\n\nThis creates a sense of achievement and motivates them to continue to Module B.",
                mascot: "/mascots/mascot-hero.png",
                background: "/images/celebration-bg.jpg",
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
                order: 1,
                type: "title",
                title: "Be a Toilet Hero Every Day",
                subtitle: "Module B: Habits, Respect & Responsibility",
                content: "Format: Learn Through Play",
                background: "/backgrounds/module-2-bg.jpg"
              },
              {
                order: 2,
                type: "content",
                title: "Ready to Help?",
                subtitle: "Section 1: Hello Again!",
                content: "You learned how clean toilets keep us healthy. Now let's learn how YOU can help keep them clean!\n\n(Mascot welcomes the student back.)",
                mascot: "/mascots/mascot-greeting.png",
                background: "/backgrounds/module-2-bg.jpg"
              },
              {
                order: 3,
                type: "content",
                title: "You are not the only one!",
                subtitle: "Section 2: Shared Spaces",
                content: "Toilets are for everyone. When we leave them clean, we are being kind to the next person.\n\n• Clean Choice: The next person (friend or teacher) smiles!\n• Messy Choice: The next person looks very unhappy.",
              },
              {
                order: 4,
                type: "comparison",
                title: "Toilet Sharing",
                subtitle: "Section 2: Shared Spaces",
                content: "We take turns and share the clean toilet!",
                image: "clean_messy_comparison.png",
                background: "/backgrounds/m2-sharing-bg.jpg",
                invertChoices: true,
              },
              {
                order: 5,
                type: "content",
                title: "Hero or Oops?",
                subtitle: "Section 3: Hero or Oops?",
                content: "Toilet Hero Tutorial: Tap to Learn!\n\n• Flush: Always flush after use.\n• Bin: Put tissues in the bin.\n• Dry Floor: Keep the floor dry.\n• No Playing: The toilet is not a playground.",
                mascot: "/mascots/mascot-pointing.png",
              },
              {
                order: 6,
                type: "game",
                title: "Toilet Hero Behavior Game",
                subtitle: "Section 3: Hero or Oops?",
                gameType: "HeroOrOops",
                content: "Hero or Oops?\nLook at the scenario and decide if it's a 'Toilet Hero' choice or an 'Oops' choice!",
                invertChoices: true,
              },
              {
                order: 7,
                type: "content",
                title: "Help our Heroes!",
                subtitle: "Section 4: Our Cleaners",
                content: "Cleaners work very hard every day to keep us safe. When we flush and keep things tidy, their job is much easier!\n\n'When we help, cleaners can do their work more easily!'",
                mascot: "/mascots/mascot-pointing.png",
              },
              {
                order: 8,
                type: "game",
                title: "Clean-Up Challenge",
                subtitle: "Game: Clean-Up Challenge",
                gameType: "CleanupChallenge",
                content: "Small Mess, Big Help\nInteractive 'Spot the Mess' game. Tapping the correct action fixes the scene:\n\n• Tissue on floor → Tap Bin\n• Water spill → Tap Wipe\n• Unflushed toilet → Tap Flush",
                background: "/backgrounds/cleanup-challenge-bg.jpg"
              },
              {
                order: 9,
                type: "celebration",
                title: "The Toilet Hero Pledge",
                subtitle: "I Promise To...",
                content: "• Use toilets properly\n• Keep toilets clean\n• Wash my hands\n• Be kind to cleaners",
              },
              {
                order: 10,
                type: "quiz",
                title: "Quick Hero Quiz!",
                content: "Prove you're a Toilet Hero by passing this quick check!",
                questions: [
                  {
                    id: "m2-q1",
                    type: "MULTIPLE_CHOICE",
                    question: "What should you do after using the toilet?",
                    options: ["Flush properly!", "Leave it for later."],
                    correctAnswer: "Flush properly!"
                  },
                  {
                    id: "m2-q2",
                    type: "MULTIPLE_CHOICE",
                    question: "True or False: Toilets are shared spaces.",
                    options: ["TRUE!", "FALSE!"],
                    correctAnswer: "TRUE!"
                  },
                  {
                    id: "m2-q3",
                    type: "MULTIPLE_CHOICE",
                    question: "Who helps keep toilets clean?",
                    options: ["Everyone!", "Only the cleaners."],
                    correctAnswer: "Everyone!"
                  },
                  {
                    id: "m2-q4",
                    type: "MULTIPLE_CHOICE",
                    question: "Does a Toilet Hero help others?",
                    options: ["Yes, of course!", "No, just themselves."],
                    correctAnswer: "Yes, of course!"
                  }
                ],
              },
              {
                order: 11,
                type: "celebration",
                title: "Great Job!",
                subtitle: "You Are Now An Official Toilet Hero!",
                content: "Thank you for making Singapore's toilets clean and happy for everyone.\n\nYou have earned your Module B Certificate!",
                mascot: "/mascots/m2-mascot-final.png",
                image: "/mascots/m2-badge-final.png",
                background: "/backgrounds/module-2-final-bg.png",
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
