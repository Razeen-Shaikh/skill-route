import prisma from "./prisma";

export async function logActivity(
  userId: string,
  type: string,
  referenceId?: string,
  value?: number,
  description?: string
) {
  await prisma.recentActivity.create({
    data: { userId: Number(userId), type, referenceId: referenceId ? Number(referenceId) : undefined, value, description },
  });
}
