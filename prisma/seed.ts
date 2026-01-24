// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ===== 2. Create Users (Teacher & Students) =====
  console.log("\n👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@school.edu" },
    update: {},
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
    update: {},
    create: {
      email: "alice@school.edu",
      password: hashedPassword,
      name: "Alice Johnson",
      role: "STUDENT",
    },
  });
  console.log(`✓ Student created: ${student1.name}`);

  const student2 = await prisma.user.upsert({
    where: { email: "bob@school.edu" },
    update: {},
    create: {
      email: "bob@school.edu",
      password: hashedPassword,
      name: "Bob Williams",
      role: "STUDENT",
    },
  });
  console.log(`✓ Student created: ${student2.name}`);

  // ===== 3. Create Modules =====
  console.log("\n📚 Creating modules...");
  // Create modules (let IDs auto-generate)
  const module1 = await prisma.module.create({
    data: {
      title: "Why Clean Toilets Matter",
      description: "Understanding shared spaces & germs",
      grade: 3,
      subject: "Cleaner",
      content: "Content...",
    },
  });
  console.log(`✓ Module created: ${module1.title}`);
  const module2 = await prisma.module.create({
    data: {
      title: "Using the Toilet the Right Way",
      description: "Proper usage and etiquette",
      grade: 3,
      subject: "Cleaner",
      content: "Content...",
    },
  });
  console.log(`✓ Module created: ${module2.title}`);
  const module3 = await prisma.module.create({
    data: {
      title: "Handwashing Super Skills",
      description: "Hygiene mastery with soap",
      grade: 3,
      subject: "Cleaner",
      content: "Content...",
    },
  });
  console.log(`✓ Module created: ${module3.title}`);

  //   const scienceModule = await prisma.module.upsert({
  //     where: { id: "science-101" },
  //     update: {},
  //     create: {
  //       id: "science-101",
  //       title: "The Water Cycle",
  //       description: "Understand how water moves through Earth and atmosphere",
  //       grade: 4,
  //       subject: "Science",
  //       content: "Exploration of evaporation, condensation, and precipitation.",
  //     },
  //   });
  //   console.log(`✓ Module created: ${scienceModule.title}`);

  // ===== 4. Create Lessons =====
  console.log("\n📖 Creating lessons...");
  const lesson1 = await prisma.lesson.upsert({
    where: { id: "lesson-1" },
    update: {},
    create: {
      id: "lesson-1",
      moduleId: module1.id,
      title: "Introduction to Multiplication",
      content:
        "Multiplication is a way of adding groups of equal sizes. For example, 3 × 4 means 3 groups of 4.",
      order: 1,
    },
  });
  console.log(`✓ Lesson created: ${lesson1.title}`);

  // ===== 5. Create Quizzes with Different Types =====
  console.log("\n❓ Creating quizzes...");

  // MULTIPLE CHOICE QUIZ
  const multipleChoiceQuiz = await prisma.quiz.upsert({
    where: { id: "quiz-mc-1" },
    update: {},
    create: {
      id: "quiz-mc-1",
      moduleId: module1.id,
      title: "Multiplication Facts Quiz",
      type: "MULTIPLE_CHOICE",
      passingScore: 70,
      questions: JSON.stringify([
        {
          id: "mc-1",
          question: "What is 7 × 8?",
          type: "MULTIPLE_CHOICE",
          correctAnswer: 1,
          options: ["54", "56", "58", "60"],
          points: 10,
        },
        {
          id: "mc-2",
          question: "What is 9 × 9?",
          type: "MULTIPLE_CHOICE",
          correctAnswer: 2,
          options: ["72", "75", "81", "90"],
          points: 10,
        },
        {
          id: "mc-3",
          question: "What is 6 × 7?",
          type: "MULTIPLE_CHOICE",
          correctAnswer: 2,
          options: ["40", "41", "42", "43"],
          points: 10,
        },
        {
          id: "mc-4",
          question: "What is 5 × 12?",
          type: "MULTIPLE_CHOICE",
          correctAnswer: 3,
          options: ["50", "55", "58", "60"],
          points: 10,
        },
        {
          id: "mc-5",
          question: "What is 8 × 6?",
          type: "MULTIPLE_CHOICE",
          correctAnswer: 1,
          options: ["46", "48", "50", "52"],
          points: 10,
        },
      ]),
    },
  });
  console.log(`✓ Multiple Choice Quiz created: ${multipleChoiceQuiz.title}`);

  // TRUE/FALSE QUIZ
  const trueFalseQuiz = await prisma.quiz.upsert({
    where: { id: "quiz-tf-1" },
    update: {},
    create: {
      id: "quiz-tf-1",
      moduleId: module1.id,
      title: "Water Cycle Concepts",
      type: "TRUE_FALSE",
      passingScore: 75,
      questions: JSON.stringify([
        {
          id: "tf-1",
          question: "Water evaporates from oceans, lakes, and rivers.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
        {
          id: "tf-2",
          question: "Condensation is when water vapor turns into liquid water.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
        {
          id: "tf-3",
          question: "Precipitation only occurs as rain.",
          type: "TRUE_FALSE",
          correctAnswer: false,
          points: 5,
        },
        {
          id: "tf-4",
          question: "The sun provides energy for the water cycle.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
        {
          id: "tf-5",
          question: "Water vapor is invisible.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
        {
          id: "tf-6",
          question: "Clouds form during the evaporation process.",
          type: "TRUE_FALSE",
          correctAnswer: false,
          points: 5,
        },
        {
          id: "tf-7",
          question: "Precipitation is part of the water cycle.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
        {
          id: "tf-8",
          question: "The water cycle has no beginning or end.",
          type: "TRUE_FALSE",
          correctAnswer: true,
          points: 5,
        },
      ]),
    },
  });
  console.log(`✓ True/False Quiz created: ${trueFalseQuiz.title}`);

  // LONG TEXT QUIZ
  const longTextQuiz = await prisma.quiz.upsert({
    where: { id: "quiz-lt-1" },
    update: {},
    create: {
      id: "quiz-lt-1",
      moduleId: module1.id,
      title: "Multiplication Problem Solving",
      type: "LONG_TEXT",
      passingScore: 70,
      questions: JSON.stringify([
        {
          id: "lt-1",
          question:
            "A bakery makes 12 cookies in each batch. If they make 5 batches, how many cookies do they make? Explain how you solved this problem using multiplication.",
          type: "LONG_TEXT",
          minWords: 50,
          maxWords: 300,
          points: 50,
        },
        {
          id: "lt-2",
          question:
            "Describe a real-world situation where you would use multiplication. Explain what you would multiply and why.",
          type: "LONG_TEXT",
          minWords: 50,
          maxWords: 300,
          points: 50,
        },
      ]),
    },
  });
  //   console.log(`✓ Long Text Quiz created: ${longTextQuiz.title}`);

  //   // ===== 6. Enroll Students =====
  //   console.log("\n📝 Enrolling students in modules...");
  //   const enrollment1 = await prisma.studentModule.upsert({
  //     where: {
  //       userId_moduleId: { userId: student1.id, moduleId: module1.id },
  //     },
  //     update: {},
  //     create: {
  //       userId: student1.id,
  //       moduleId: module1.id,
  //       isCompleted: false,
  //     },
  //   });
  //   console.log(`✓ ${student1.name} enrolled in ${module1.title}`);

  //   const enrollment2 = await prisma.studentModule.upsert({
  //     where: {
  //       userId_moduleId: { userId: student2.id, moduleId: module1.id },
  //     },
  //     update: {},
  //     create: {
  //       userId: student2.id,
  //       moduleId: module1.id,
  //       isCompleted: false,
  //     },
  //   });
  //   console.log(`✓ ${student2.name} enrolled in ${module1.title}`);

  //   // ===== 7. Create Progress Tracking =====
  //   console.log("\n📊 Creating progress tracking...");
  //   const progress1 = await prisma.progressTracking.upsert({
  //     where: {
  //       userId_moduleId: { userId: student1.id, moduleId: module1.id },
  //     },
  //     update: {},
  //     create: {
  //       userId: student1.id,
  //       moduleId: module1.id,
  //       lessonsCompleted: 1,
  //       activitiesCompleted: 2,
  //       quizzesPassed: 0,
  //       overallProgress: 30,
  //     },
  //   });
  //   console.log(`✓ Progress tracked for ${student1.name}`);

  //   // ===== 8. Create Sample Quiz Submissions =====
  //   console.log("\n✅ Creating sample quiz submissions...");

  //   // Sample MC submission
  //   const mcSubmission = await prisma.quizSubmission.upsert({
  //     where: { id: "submission-mc-1" },
  //     update: {},
  //     create: {
  //       id: "submission-mc-1",
  //       userId: student1.id,
  //       quizId: multipleChoiceQuiz.id,
  //       answers: JSON.stringify([
  //         { questionId: "mc-1", answer: 1, isCorrect: true, score: 10 },
  //         { questionId: "mc-2", answer: 2, isCorrect: true, score: 10 },
  //         { questionId: "mc-3", answer: 2, isCorrect: true, score: 10 },
  //         { questionId: "mc-4", answer: 3, isCorrect: true, score: 10 },
  //         { questionId: "mc-5", answer: 0, isCorrect: false, score: 0 },
  //       ]),
  //       score: 80,
  //       passed: true,
  //     },
  //   });
  //   console.log(`✓ MC Quiz submission created (Score: 80%)`);

  //   // Sample TF submission
  //   const tfSubmission = await prisma.quizSubmission.upsert({
  //     where: { id: "submission-tf-1" },
  //     update: {},
  //     create: {
  //       id: "submission-tf-1",
  //       userId: student2.id,
  //       quizId: trueFalseQuiz.id,
  //       answers: JSON.stringify([
  //         { questionId: "tf-1", answer: true, isCorrect: true, score: 5 },
  //         { questionId: "tf-2", answer: true, isCorrect: true, score: 5 },
  //         { questionId: "tf-3", answer: false, isCorrect: true, score: 5 },
  //         { questionId: "tf-4", answer: true, isCorrect: true, score: 5 },
  //         { questionId: "tf-5", answer: true, isCorrect: true, score: 5 },
  //         { questionId: "tf-6", answer: true, isCorrect: false, score: 0 },
  //         { questionId: "tf-7", answer: true, isCorrect: true, score: 5 },
  //         { questionId: "tf-8", answer: true, isCorrect: true, score: 5 },
  //       ]),
  //       score: 87.5,
  //       passed: true,
  //     },
  //   });
  //   console.log(`✓ TF Quiz submission created (Score: 87.5%)`);

  //   // Sample LT submission (pending grading)
  //   const ltSubmission = await prisma.quizSubmission.upsert({
  //     where: { id: "submission-lt-1" },
  //     update: {},
  //     create: {
  //       id: "submission-lt-1",
  //       userId: student1.id,
  //       quizId: longTextQuiz.id,
  //       answers: JSON.stringify([
  //         {
  //           questionId: "lt-1",
  //           answer:
  //             "The bakery makes 12 cookies in each batch. If they make 5 batches, they will make 12 × 5 = 60 cookies total. I used multiplication because we have 5 groups of 12 cookies, and multiplication is the quick way to add equal groups. Instead of adding 12 + 12 + 12 + 12 + 12, we can multiply 12 × 5.",
  //           isCorrect: undefined,
  //           score: 0,
  //         },
  //         {
  //           questionId: "lt-2",
  //           answer:
  //             "A real-world situation where I use multiplication is when buying things at the store. For example, if apples cost $2 each and I want to buy 6 apples, I multiply 2 × 6 to find the total cost is $12. I multiply the price per apple by the number of apples to get the total price.",
  //           isCorrect: undefined,
  //           score: 0,
  //         },
  //       ]),
  //       score: 0,
  //       passed: false,
  //     },
  //   });
  //   console.log(`✓ LT Quiz submission created (Pending grading)`);

  //   // ===== 9. Create Sample Certificate =====
  //   console.log("\n🏆 Creating sample certificate...");
  //   const certificate = await prisma.certificate.upsert({
  //     where: { id: "cert-1" },
  //     update: {},
  //     create: {
  //       id: "cert-1",
  //       userId: student2.id,
  //       moduleId: module1.id,
  //       moduleName: module1.title,
  //       certificateNumber: `CERT-${Date.now()}-${student2.id}`,
  //       expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  //     },
  //   });
  //   console.log(`✓ Certificate created for ${student2.name}`);

  //   console.log("\n✨ Database seeding completed successfully!");
  //   console.log("\n📋 Test Credentials:");
  //   console.log("Teacher:");
  //   console.log("  Email: teacher@school.edu");
  //   console.log("  Password: password123");
  //   console.log("  School Code: DPS001");
  //   console.log("\nStudent 1:");
  //   console.log("  Email: alice@school.edu");
  //   console.log("  Password: password123");
  //   console.log("  School Code: DPS001");
  //   console.log("\nStudent 2:");
  //   console.log("  Email: bob@school.edu");
  //   console.log("  Password: password123");
  //   console.log("  School Code: DPS001");
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
