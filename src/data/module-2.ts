
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
}

export const moduleTwoSlides: Module2Slide[] = [
    {
        id: "m2-slide-1",
        type: "title",
        title: "Be a Toilet Hero Every Day",
        subtitle: "Module B: Habits, Respect & Responsibility",
        content: "Format: Learn Through Play",
        order: 1
    },
    {
        id: "m2-slide-2",
        type: "content",
        title: "Ready to Help?",
        subtitle: "Section 1: Hello Again!",
        content: "You learned how clean toilets keep us healthy. Now let's learn how YOU can help keep them clean!\n\n(Mascot welcomes the student back.)",
        mascot: "/mascots/mascot-greeting.png",
        order: 2
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
        order: 6
    },
    {
        id: "m2-slide-7",
        type: "content",
        title: "Help our Heroes!",
        subtitle: "Section 4: Our Cleaners",
        content: "Cleaners work very hard every day to keep us safe. When we flush and keep things tidy, their job is much easier!\n\n'When we help, cleaners can do their work more easily!'",
        mascot: "/mascots/mascot-happy.png",
        order: 7
    },
    {
        id: "m2-slide-8",
        type: "game",
        title: "Clean-Up Challenge",
        subtitle: "Game: Clean-Up Challenge",
        gameType: "CleanupChallenge",
        content: "Small Mess, Big Help\nInteractive 'Spot the Mess' game. Tapping the correct action fixes the scene:\n\n• Tissue on floor → Tap Bin\n• Water spill → Tap Wipe\n• Unflushed toilet → Tap Flush",
        order: 8
    },
    {
        id: "m2-slide-9",
        type: "celebration",
        title: "The Toilet Hero Pledge",
        subtitle: "I Promise To...",
        content: "• Use toilets properly\n• Keep toilets clean\n• Wash my hands\n• Be kind to cleaners",
        order: 10
    }
];
