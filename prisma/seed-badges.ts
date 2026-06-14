import prisma from "@/lib/prisma";
import { seedBadges, syncAllUserBadges } from "@/lib/seedBadges";

async function main() {
    await seedBadges();
    await syncAllUserBadges();
    console.log("Badge seeding complete.");
}

main()
    .catch((error) => {
        console.error("Badge seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
