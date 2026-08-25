import { toAbsoluteHttpUrl } from "./site-url";

const AUTH_ORIGIN_KEYS = ["AUTH_URL", "NEXTAUTH_URL"] as const;

function readEnv(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

function isLocalhostOrigin(url: string): boolean {
    try {
        const { hostname } = new URL(url);
        return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
        return false;
    }
}

/** Auth.js reads AUTH_URL at init. Drop values that would send a bad GitHub redirect_uri. */
export function sanitizeAuthUrlEnv(): void {
    for (const key of AUTH_ORIGIN_KEYS) {
        const value = readEnv(key);
        if (!value) continue;

        const resolved = toAbsoluteHttpUrl(value);
        if (!resolved) {
            console.warn(
                `[auth] Unsetting invalid ${key}="${value}". Expected an http(s) origin, not an email.`,
            );
            delete process.env[key];
            continue;
        }

        if (process.env.NODE_ENV === "production" && isLocalhostOrigin(resolved)) {
            console.warn(
                `[auth] Unsetting ${key}="${value}" in production so GitHub OAuth uses the request host.`,
            );
            delete process.env[key];
            continue;
        }

        if (value !== resolved) {
            console.warn(`[auth] Normalizing ${key} from "${value}" to "${resolved}".`);
            process.env[key] = resolved;
        }
    }
}

export function getGitHubOAuthConfigError(): string | null {
    const clientId = readEnv("AUTH_GITHUB_ID") ?? readEnv("GITHUB_ID");
    const clientSecret =
        readEnv("AUTH_GITHUB_SECRET") ?? readEnv("GITHUB_SECRET");

    if (!clientId || !clientSecret) {
        return "Set AUTH_GITHUB_ID and AUTH_GITHUB_SECRET in .env.local from GitHub → Settings → Developer settings → OAuth Apps.";
    }

    if (/^\d+$/.test(clientId)) {
        return `AUTH_GITHUB_ID="${clientId}" is a numeric App ID, not an OAuth Client ID. Copy the "Client ID" string from your OAuth App (for example Ov23li… or Iv1.…).`;
    }

    return null;
}

export function getGitHubOAuthCredentials(): {
    clientId: string;
    clientSecret: string;
} {
    const configError = getGitHubOAuthConfigError();
    if (configError) {
        throw new Error(configError);
    }

    return {
        clientId: (readEnv("AUTH_GITHUB_ID") ?? readEnv("GITHUB_ID"))!,
        clientSecret: (readEnv("AUTH_GITHUB_SECRET") ??
            readEnv("GITHUB_SECRET"))!,
    };
}

export function getAuthSecret(): string | undefined {
    return readEnv("AUTH_SECRET") ?? readEnv("NEXTAUTH_SECRET");
}

export function getAuthConfigErrors(): string[] {
    const errors: string[] = [];
    const oauthError = getGitHubOAuthConfigError();
    if (oauthError) {
        errors.push(oauthError);
    }
    if (!getAuthSecret()) {
        errors.push(
            "Set AUTH_SECRET in Vercel (run: openssl rand -base64 32).",
        );
    }
    if (!readEnv("DATABASE_URL")) {
        errors.push(
            "Set DATABASE_URL (Neon pooled URL) and DIRECT_URL (Neon direct URL) in Vercel Production.",
        );
    }
    return errors;
}
