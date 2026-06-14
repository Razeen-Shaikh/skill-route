export const AUTH_LOGIN_PATH = "/auth/login";
export const AUTH_REGISTER_PATH = "/auth/register";

export type AuthNavLink = {
    href: string;
    label: "Login" | "Register";
};

export function getAuthNavLink(pathname: string): AuthNavLink {
    if (pathname === AUTH_LOGIN_PATH) {
        return { href: AUTH_REGISTER_PATH, label: "Register" };
    }

    if (pathname === AUTH_REGISTER_PATH) {
        return { href: AUTH_LOGIN_PATH, label: "Login" };
    }

    return { href: AUTH_LOGIN_PATH, label: "Login" };
}

export function getAuthAlternateLink(page: "login" | "register"): AuthNavLink & { prompt: string } {
    if (page === "login") {
        return {
            href: AUTH_REGISTER_PATH,
            label: "Register",
            prompt: "Don't have an account?",
        };
    }

    return {
        href: AUTH_LOGIN_PATH,
        label: "Login",
        prompt: "Already have an account?",
    };
}
