import { afterEach, describe, expect, it, vi } from "vitest";
import { getCanonicalSiteUrl, getPublicSiteUrl } from "../site-url";

const ENV_KEYS = [
    "NEXT_PUBLIC_APP_URL",
    "APP_URL",
    "AUTH_URL",
    "NEXTAUTH_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "VERCEL_URL",
] as const;

const originalEnv = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
);

function clearSiteUrlEnv() {
    for (const key of ENV_KEYS) {
        delete process.env[key];
    }
}

describe("site-url", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        clearSiteUrlEnv();
        for (const key of ENV_KEYS) {
            const value = originalEnv[key];
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    it("uses a valid NEXT_PUBLIC_APP_URL", () => {
        clearSiteUrlEnv();
        process.env.NEXT_PUBLIC_APP_URL = "https://repomind.example.com/";

        expect(getCanonicalSiteUrl()).toBe("https://repomind.example.com");
    });

    it("skips an email accidentally set as NEXT_PUBLIC_APP_URL", () => {
        clearSiteUrlEnv();
        process.env.NEXT_PUBLIC_APP_URL = "ajyenduc@gmail.com";
        process.env.VERCEL_URL = "repomind.vercel.app";
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        expect(getCanonicalSiteUrl()).toBe("https://repomind.vercel.app");
        expect(warn).toHaveBeenCalled();
    });

    it("does not throw when new URL would reject the email", () => {
        clearSiteUrlEnv();
        process.env.NEXT_PUBLIC_APP_URL = "ajyenduc@gmail.com";

        expect(() => new URL(getCanonicalSiteUrl())).not.toThrow();
        expect(getCanonicalSiteUrl()).toBe("http://localhost:3000");
    });

    it("adds https to a hostname-only Vercel URL", () => {
        clearSiteUrlEnv();
        process.env.VERCEL_PROJECT_PRODUCTION_URL = "repomind.vercel.app";

        expect(getPublicSiteUrl()).toBe("https://repomind.vercel.app");
    });

    it("strips a GitHub callback path down to the origin", () => {
        clearSiteUrlEnv();
        process.env.NEXT_PUBLIC_APP_URL =
            "https://repo-mind-blue.vercel.app/api/auth/callback/github";

        expect(getCanonicalSiteUrl()).toBe("https://repo-mind-blue.vercel.app");
    });
});
