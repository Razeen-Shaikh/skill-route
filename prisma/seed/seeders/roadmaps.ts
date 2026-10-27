import prisma from "@/lib/prisma";
import { Roadmap, RoadmapStep, StepStatus } from "@/generated/prisma";
import { seedHelper } from "@/lib/seedHelper";
import { roadmapData } from "@/lib/data";

export async function seedRoadmaps(createdByIds: string[]): Promise<{
  roadmaps: Roadmap[];
  steps: RoadmapStep[];
}> {
  console.log("🌱 Seeding roadmaps...");
  const roadmaps: Roadmap[] = [];

  for (const roadmap of roadmapData) {
    const createRoadmap = await prisma.roadmap.create({
      data: {
        title: roadmap.title,
        description: roadmap.description,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
        type: seedHelper.getRoadmapType() || roadmap.type,
        category: [
          "Web Development",
          "Data Science",
          "Machine Learning",
          "Mobile Development",
        ][seedHelper.getRandomInt(0, 3)],
        createdById:
          createdByIds[Math.floor(Math.random() * createdByIds.length)],
      },
    });
    roadmaps.push(createRoadmap);
  }

  console.log(`🌱 Created ${roadmaps.length} roadmaps`);

  console.log("🌱 Seeding roadmap steps...");
  await prisma.roadmapStep.deleteMany();

  const roadmapSteps: RoadmapStep[] = [];

  const html = await prisma.roadmapStep.create({
    data: {
      title: "HTML",
      description: "Learn the basics of HTML.",
      status: StepStatus.COMPLETED,
      roadmapId: roadmaps[0].id,
      order: 1,
      progress: 100,
      completed: seedHelper.getRandomBool(),
      completedAt: seedHelper.getRandomDate(
        new Date(2022, 0, 1),
        new Date(2024, 11, 31)
      ),
      parentId: null,
    },
  });
  roadmapSteps.push(html);

  const css = await prisma.roadmapStep.create({
    data: {
      title: "CSS",
      description: "Understand the fundamentals of CSS.",
      roadmapId: roadmaps[0].id,
      status: StepStatus.IN_PROGRESS,
      order: 2,
      progress: seedHelper.getRandomBool() ? 100 : 0,
      completed: seedHelper.getRandomBool(),
      completedAt: seedHelper.getRandomBool()
        ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
        : null,
      parentId: html.id,
    },
  });
  roadmapSteps.push(css);

  const js = await prisma.roadmapStep.create({
    data: {
      title: "JavaScript",
      description: "Master the essentials of JavaScript.",
      roadmapId: roadmaps[0].id,
      status: StepStatus.IN_PROGRESS,
      order: 3,
      progress: seedHelper.getRandomBool() ? 100 : 0,
      completed: seedHelper.getRandomBool(),
      completedAt: seedHelper.getRandomBool()
        ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
        : null,
      parentId: html.id,
    },
  });
  roadmapSteps.push(js);

  roadmapSteps.push(
    await prisma.roadmapStep.create({
      data: {
        title: "Tailwind CSS",
        description: "Learn the basics of Tailwind CSS.",
        roadmapId: roadmaps[0].id,
        status: StepStatus.NOT_STARTED,
        order: 1,
        progress: seedHelper.getRandomBool() ? 100 : 0,
        completed: seedHelper.getRandomBool(),
        completedAt: seedHelper.getRandomBool()
          ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
          : null,
        parentId: css.id,
      },
    })
  );

  roadmapSteps.push(
    await prisma.roadmapStep.create({
      data: {
        title: "React",
        description: "Get introduced to React.",
        roadmapId: roadmaps[0].id,
        status: StepStatus.NOT_STARTED,
        order: 4,
        progress: seedHelper.getRandomBool() ? 100 : 0,
        completed: seedHelper.getRandomBool(),
        completedAt: seedHelper.getRandomBool()
          ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
          : null,
        parentId: html.id,
      },
    })
  );

  roadmapSteps.push(
    await prisma.roadmapStep.create({
      data: {
        title: "Node.js",
        description: "Learn the basics of Node.js.",
        roadmapId: roadmaps[0].id,
        status: StepStatus.NOT_STARTED,
        order: 5,
        progress: seedHelper.getRandomBool() ? 100 : 0,
        completed: seedHelper.getRandomBool(),
        completedAt: seedHelper.getRandomBool()
          ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
          : null,
        parentId: html.id,
      },
    })
  );

  console.log(`🌱 Created ${roadmapSteps.length} roadmap steps`);
  return { roadmaps, steps: roadmapSteps };
}
