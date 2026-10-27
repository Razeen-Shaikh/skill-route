import prisma from "@/lib/prisma";
import { Roadmap, RoadmapStep, StepStatus } from "@/generated/prisma";
import { stackRoadmaps } from "../data/roadmaps";

export async function seedRoadmaps(createdByIds: string[]): Promise<{
    roadmaps: Roadmap[];
    steps: RoadmapStep[];
}> {
    console.log("🌱 Seeding roadmaps...");
    const createdById = createdByIds[0];
    if (!createdById) {
        throw new Error("At least one user is required to seed roadmaps.");
    }

    await prisma.tutorial.updateMany({
        where: { stepsId: { not: null } },
        data: { stepsId: null },
    });
    await prisma.roadmap.deleteMany();

    const roadmaps: Roadmap[] = [];
    const roadmapSteps: RoadmapStep[] = [];

    for (const roadmap of stackRoadmaps) {
        const createdRoadmap = await prisma.roadmap.create({
            data: {
                title: roadmap.title,
                description: roadmap.description,
                category: roadmap.category,
                type: roadmap.type,
                createdById,
            },
        });
        roadmaps.push(createdRoadmap);

        const stepIds = new Map<string, string>();
        for (const step of roadmap.steps) {
            const parentId = step.parentKey ? stepIds.get(step.parentKey) ?? null : null;
            const createdStep = await prisma.roadmapStep.create({
                data: {
                    title: step.title,
                    description: step.description,
                    roadmapId: createdRoadmap.id,
                    parentId,
                    order: step.order,
                    status: parentId ? StepStatus.NOT_STARTED : StepStatus.IN_PROGRESS,
                    progress: parentId ? 0 : 10,
                    completed: false,
                },
            });
            stepIds.set(step.key, createdStep.id);
            roadmapSteps.push(createdStep);
        }
    }

    console.log(`🌱 Created ${roadmaps.length} roadmaps and ${roadmapSteps.length} steps`);
    return { roadmaps, steps: roadmapSteps };
}

const isDirectRun = process.argv[1]?.replaceAll("\\", "/").endsWith("prisma/seed/seeders/roadmaps.ts");

if (isDirectRun) {
    prisma.user
        .findFirst({ select: { id: true } })
        .then((user) => {
            if (!user) throw new Error("Create a user before seeding roadmaps.");
            return seedRoadmaps([user.id]);
        })
        .catch((error) => {
            console.error(error);
            process.exitCode = 1;
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
