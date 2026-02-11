
export interface Module2Slide {
    id: string;
    type: "title" | "content" | "image" | "video" | "game" | "quiz" | "comparison" | "celebration";
    title: string;
    subtitle?: string; // Used for "Section X: ..."
    content?: string;
    image?: string;
    videoUrl?: string;
    gameType?: string;
    questions?: any[];
    order: number;
    mascot?: string;
    background?: string;
    invertChoices?: boolean;
}

export const moduleTwoSlides: Module2Slide[] = [
    {
        id: "m2-slide-1",
        type: "title",
        title: "Be a Toilet Hero Every Day",
        subtitle: "Module B: Habits, Respect & Responsibility",
        content: "Format: Learn Through Play",
        order: 1,
        background: "/backgrounds/module-2-bg.jpg"
    },
    {
        id: "m2-slide-2",
        type: "content",
        title: "Ready to Help?",
        subtitle: "Section 1: Hello Again!",
        content: "You learned how clean toilets keep us healthy. Now let's learn how YOU can help keep them clean!\n\n(Mascot welcomes the student back.)",
        mascot: "/mascots/mascot-greeting.png",
        order: 2,
        background: "/backgrounds/module-2-bg.jpg"
    },
    {
        id: "m2-slide-3",
        type: "content",
        title: "You are not the only one!",
        subtitle: "Section 2: Shared Spaces",
        content: "Toilets are for everyone. When we leave them clean, we are being kind to the next person.\n\n• Clean Choice: The next person (friend or teacher) smiles!\n• Messy Choice: The next person looks very unhappy.",
        order: 3
    },
    {
        id: "m2-slide-4",
        type: "comparison",
        title: "Toilet Sharing",
        subtitle: "Section 2: Shared Spaces",
        content: "We take turns and share the clean toilet!",
        image: "clean_messy_comparison.png",
        background: "/backgrounds/m2-sharing-bg.jpg",
        invertChoices: true,
        order: 4
    },
    {
        id: "m2-slide-5",
        type: "content",
        title: "Hero or Oops?",
        subtitle: "Section 3: Hero or Oops?",
        content: "Toilet Hero Tutorial: Tap to Learn!\n\n• Flush: Always flush after use.\n• Bin: Put tissues in the bin.\n• Dry Floor: Keep the floor dry.\n• No Playing: The toilet is not a playground.",
        mascot: "/mascots/mascot-pointing.png",
        order: 5
    },
    {
        id: "m2-slide-6",
        type: "game",
        title: "Toilet Hero Behavior Game",
        subtitle: "Section 3: Hero or Oops?",
        gameType: "HeroOrOops",
        content: "Hero or Oops?\nLook at the scenario and decide if it's a 'Toilet Hero' choice or an 'Oops' choice!",
        invertChoices: true,
        order: 6
    },
    {
        id: "m2-slide-7",
        type: "content",
        title: "Help our Heroes!",
        subtitle: "Section 4: Our Cleaners",
        content: "Cleaners work very hard every day to keep us safe. When we flush and keep things tidy, their job is much easier!\n\n'When we help, cleaners can do their work more easily!'",
        mascot: "/mascots/mascot-pointing.png",
        order: 7
    },
    {
        id: "m2-slide-8",
        type: "game",
        title: "Clean-Up Challenge",
        subtitle: "Game: Clean-Up Challenge",
        gameType: "CleanupChallenge",
        content: "Small Mess, Big Help\nInteractive 'Spot the Mess' game. Tapping the correct action fixes the scene:\n\n• Tissue on floor → Tap Bin\n• Water spill → Tap Wipe\n• Unflushed toilet → Tap Flush",
        order: 8,
        background: "/backgrounds/cleanup-challenge-bg.jpg"
    },
    {
        id: "m2-slide-9",
        type: "celebration",
        title: "The Toilet Hero Pledge",
        subtitle: "I Promise To...",
        content: "• Use toilets properly\n• Keep toilets clean\n• Wash my hands\n• Be kind to cleaners",
        order: 10
    },
    {
        id: "m2-quiz-1",
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
        order: 11
    },
    {
        id: "m2-celebration-final",
        type: "celebration",
        title: "Great Job!",
        subtitle: "You Are Now An Official Toilet Hero!",
        content: "Thank you for making Singapore's toilets clean and happy for everyone.\n\nYou have earned your Module B Certificate!",
        mascot: "/mascots/m2-mascot-final.png",
        image: "/mascots/m2-badge-final.png",
        background: "/backgrounds/module-2-final-bg.png",
        order: 12
    }
];
