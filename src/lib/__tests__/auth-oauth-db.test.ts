import { describe, expect, it, vi, beforeEach } from "vitest";

const {
    accountFindUniqueMock,
    accountUpdateMock,
    accountCreateMock,
    userFindUniqueMock,
    userCreateMock,
    userUpdateMock,
} = vi.hoisted(() => ({
    accountFindUniqueMock: vi.fn(),
    accountUpdateMock: vi.fn(),
    accountCreateMock: vi.fn(),
    userFindUniqueMock: vi.fn(),
    userCreateMock: vi.fn(),
    userUpdateMock: vi.fn(),
}));

vi.mock("../db", () => ({
    prisma: {
        account: {
            findUnique: accountFindUniqueMock,
            update: accountUpdateMock,
            create: accountCreateMock,
        },
        user: {
            findUnique: userFindUniqueMock,
            create: userCreateMock,
            update: userUpdateMock,
        },
    },
}));

import { linkGithubOAuthUser } from "../auth-oauth-db";

describe("linkGithubOAuthUser", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns existing user when account and user already exist", async () => {
        accountFindUniqueMock.mockResolvedValue({
            provider: "github",
            providerAccountId: "12345",
            user: { id: "user_1", githubLogin: "octocat", email: "octo@github.com" },
        });
        accountUpdateMock.mockResolvedValue({});

        const user = await linkGithubOAuthUser(
            { provider: "github", providerAccountId: "12345", type: "oauth" },
            { login: "octocat", email: "octo@github.com" }
        );

        expect(user).toEqual({ id: "user_1", githubLogin: "octocat", email: "octo@github.com" });
        expect(accountUpdateMock).toHaveBeenCalledOnce();
    });

    it("links new GitHub account to existing user by email", async () => {
        accountFindUniqueMock.mockResolvedValue(null);
        userFindUniqueMock.mockResolvedValueOnce({
            id: "user_existing",
            email: "octo@github.com",
            githubLogin: "octocat",
        });
        accountCreateMock.mockResolvedValue({});

        const user = await linkGithubOAuthUser(
            { provider: "github", providerAccountId: "67890", type: "oauth" },
            { login: "octocat", email: "octo@github.com" }
        );

        expect(user).toEqual({ id: "user_existing", email: "octo@github.com", githubLogin: "octocat" });
        expect(accountCreateMock).toHaveBeenCalledOnce();
    });

    it("creates new user when user does not exist", async () => {
        accountFindUniqueMock.mockResolvedValue(null);
        userFindUniqueMock.mockResolvedValue(null);
        const newUser = { id: "user_new", email: "new@github.com", githubLogin: "newuser" };
        userCreateMock.mockResolvedValue(newUser);

        const user = await linkGithubOAuthUser(
            { provider: "github", providerAccountId: "11111", type: "oauth" },
            { login: "newuser", email: "new@github.com", name: "New User" }
        );

        expect(user).toEqual(newUser);
        expect(userCreateMock).toHaveBeenCalledOnce();
    });

    it("throws error if both githubLogin and email are missing", async () => {
        accountFindUniqueMock.mockResolvedValue(null);
        userFindUniqueMock.mockResolvedValue(null);

        await expect(
            linkGithubOAuthUser(
                { provider: "github", providerAccountId: "22222", type: "oauth" },
                {}
            )
        ).rejects.toThrow("GitHub profile is missing login and email");
    });

    it("falls back to existing user by email on unique constraint error during creation", async () => {
        accountFindUniqueMock.mockResolvedValue(null);
        userFindUniqueMock.mockResolvedValueOnce(null); // initial lookup by email
        userFindUniqueMock.mockResolvedValueOnce(null); // initial lookup by login
        userCreateMock.mockRejectedValue(new Error("Unique constraint failed on the fields: (`email`)"));
        userFindUniqueMock.mockResolvedValueOnce({ id: "user_fallback", email: "fallback@github.com" });

        const user = await linkGithubOAuthUser(
            { provider: "github", providerAccountId: "33333", type: "oauth" },
            { login: "fallbacklogin", email: "fallback@github.com" }
        );

        expect(user).toEqual({ id: "user_fallback", email: "fallback@github.com" });
    });
});
