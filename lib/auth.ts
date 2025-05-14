import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import prisma from "./prisma";

export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}
