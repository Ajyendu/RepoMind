import { afterEach, describe, expect, it, vi } from "vitest";
import {
    getGitHubOAuthConfigError,
    getGitHubOAuthCredentials,
    sanitizeAuthUrlEnv,
} from "../auth-env";

describe("auth-env", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        delete process.env.AUTH_GITHUB_ID;
        delete process.env.AUTH_GITHUB_SECRET;
        delete process.env.GITHUB_ID;
        delete process.env.GITHUB_SECRET;
        delete process.env.AUTH_URL;
        delete process.env.NEXTAUTH_URL;
    });

    it("flags numeric-only client IDs", () => {
        process.env.AUTH_GITHUB_ID = "168120496";
        process.env.AUTH_GITHUB_SECRET = "secret";

        expect(getGitHubOAuthConfigError()).toMatch(/numeric App ID/i);
    });

    it("accepts standard GitHub OAuth client IDs", () => {
        process.env.AUTH_GITHUB_ID = "Ov23liExampleClientId";
        process.env.AUTH_GITHUB_SECRET = "secret";

        expect(getGitHubOAuthConfigError()).toBeNull();
        expect(getGitHubOAuthCredentials()).toEqual({
            clientId: "Ov23liExampleClientId",
            clientSecret: "secret",
        });
    });

    it("unsets AUTH_URL when it is an email address", () => {
        process.env.AUTH_URL = "ajyenduc@gmail.com";
        vi.spyOn(console, "warn").mockImplementation(() => {});

        sanitizeAuthUrlEnv();

        expect(process.env.AUTH_URL).toBeUndefined();
    });

    it("strips AUTH_URL down to origin when a callback path is included", () => {
        process.env.AUTH_URL =
            "https://repo-mind-blue.vercel.app/api/auth/callback/github";
        vi.spyOn(console, "warn").mockImplementation(() => {});

        sanitizeAuthUrlEnv();

        expect(process.env.AUTH_URL).toBe("https://repo-mind-blue.vercel.app");
    });
});
