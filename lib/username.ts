import prisma from "@/lib/prisma";

const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export function normalizeUsername(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}

export function usernameValidationError(value: string) {
    const username = normalizeUsername(value);
    if (username.length < 3) {
        return "Username must be at least 3 characters and use only letters, numbers, or underscores.";
    }
    if (!USERNAME_PATTERN.test(username)) {
        return "Username must use only letters, numbers, or underscores.";
    }
    return null;
}

export async function isUsernameTaken(username: string) {
    const existing = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
    });
    return Boolean(existing);
}

export async function allocateUsername(preferred: string) {
    const base = normalizeUsername(preferred) || "user";
    let username = base;
    let counter = 1;

    while (await isUsernameTaken(username)) {
        const suffix = String(counter);
        username = `${base.slice(0, 30 - suffix.length)}${suffix}`;
        counter += 1;
    }

    return username;
}
