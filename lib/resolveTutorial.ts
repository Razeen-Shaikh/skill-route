import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

const tutorialInclude = {
    quizzes: { include: { questions: true, attempts: true } },
    progress: true,
} satisfies Prisma.TutorialInclude;

export async function findTutorialByIdentifier(identifier: string) {
    const byId = await prisma.tutorial.findUnique({
        where: { id: identifier },
        include: tutorialInclude,
    });

    if (byId) {
        return byId;
    }

    return prisma.tutorial.findFirst({
        where: {
            OR: [
                { title: { equals: identifier, mode: "insensitive" } },
                { category: { equals: identifier, mode: "insensitive" } },
            ],
        },
        orderBy: { createdAt: "asc" },
        include: tutorialInclude,
    });
}

export async function resolveTutorialId(identifier: string): Promise<string | null> {
    const tutorial = await findTutorialByIdentifier(identifier);
    return tutorial?.id ?? null;
}
