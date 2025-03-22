import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getAuthUser() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;
    return session.user;
}