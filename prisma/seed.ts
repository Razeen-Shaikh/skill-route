import prisma from "@/lib/prisma";
import { runSeed } from "./seed/index";

async function main() {
  await runSeed();
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
