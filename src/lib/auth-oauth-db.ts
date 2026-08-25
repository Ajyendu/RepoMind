import type { Account, Profile } from "next-auth";
import { prisma } from "./db";

type GithubProfile = Profile & {
    login?: string;
    email?: string | null;
    avatar_url?: string;
};

function asNonEmptyString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asEmail(value: unknown): string | undefined {
    const email = asNonEmptyString(value);
    return email?.includes("@") ? email : undefined;
}

async function resolveGithubLogin(
    account: Account,
    profile: GithubProfile | undefined,
): Promise<string | undefined> {
    const fromProfile = asNonEmptyString(profile?.login);
    if (fromProfile) {
        return fromProfile;
    }

    const token = asNonEmptyString(account.access_token);
    if (!token) {
        return undefined;
    }

    try {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "RepoMind",
            },
        });
        if (!response.ok) {
            return undefined;
        }
        const payload = (await response.json()) as { login?: unknown };
        return asNonEmptyString(payload.login);
    } catch {
        return undefined;
    }
}

export async function linkGithubOAuthUser(
    account: Account,
    profile: GithubProfile | undefined,
) {
    const rawAccountId =
        account.providerAccountId ??
        (profile as { id?: string | number } | undefined)?.id;
    const providerAccountId =
        rawAccountId !== undefined && rawAccountId !== null
            ? String(rawAccountId)
            : "";
    const githubLogin =
        (await resolveGithubLogin(account, profile)) ??
        (providerAccountId ? `gh_${providerAccountId}` : undefined);
    const email =
        asEmail(profile?.email) ??
        asEmail((account as Account & { email?: string }).email);

    const existingAccount = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider: "github",
                providerAccountId,
            },
        },
        include: { user: true },
    });

    if (existingAccount?.user) {
        await prisma.account.update({
            where: {
                provider_providerAccountId: {
                    provider: "github",
                    providerAccountId,
                },
            },
            data: {
                access_token: account.access_token ?? undefined,
                refresh_token: account.refresh_token ?? undefined,
                expires_at: account.expires_at ?? undefined,
                token_type: account.token_type ?? undefined,
                scope: account.scope ?? undefined,
                id_token: account.id_token ?? undefined,
            },
        });

        if (githubLogin && existingAccount.user.githubLogin !== githubLogin) {
            return prisma.user.update({
                where: { id: existingAccount.user.id },
                data: { githubLogin },
            });
        }

        return existingAccount.user;
    }

    const existingUser =
        (email
            ? await prisma.user.findUnique({ where: { email } })
            : null) ??
        (githubLogin
            ? await prisma.user.findUnique({ where: { githubLogin } })
            : null);

    if (existingUser) {
        try {
            await prisma.account.create({
                data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: "github",
                    providerAccountId,
                    access_token: account.access_token ?? undefined,
                    refresh_token: account.refresh_token ?? undefined,
                    expires_at: account.expires_at ?? undefined,
                    token_type: account.token_type ?? undefined,
                    scope: account.scope ?? undefined,
                    id_token: account.id_token ?? undefined,
                },
            });
        } catch {
            await prisma.account.update({
                where: {
                    provider_providerAccountId: {
                        provider: "github",
                        providerAccountId,
                    },
                },
                data: {
                    userId: existingUser.id,
                    access_token: account.access_token ?? undefined,
                    refresh_token: account.refresh_token ?? undefined,
                    expires_at: account.expires_at ?? undefined,
                    token_type: account.token_type ?? undefined,
                    scope: account.scope ?? undefined,
                    id_token: account.id_token ?? undefined,
                },
            }).catch(() => null);
        }

        if (githubLogin && existingUser.githubLogin !== githubLogin) {
            return prisma.user.update({
                where: { id: existingUser.id },
                data: { githubLogin },
            });
        }

        return existingUser;
    }

    if (!githubLogin && !email) {
        throw new Error(
            "GitHub profile is missing login and email; ensure the OAuth app has user:email scope.",
        );
    }

    try {
        return await prisma.user.create({
            data: {
                email,
                emailVerified: email ? new Date() : undefined,
                name:
                    typeof profile?.name === "string"
                        ? profile.name
                        : githubLogin,
                image:
                    asNonEmptyString(profile?.image) ??
                    asNonEmptyString(profile?.avatar_url),
                githubLogin,
                accounts: {
                    create: {
                        type: account.type,
                        provider: "github",
                        providerAccountId,
                        access_token: account.access_token ?? undefined,
                        refresh_token: account.refresh_token ?? undefined,
                        expires_at: account.expires_at ?? undefined,
                        token_type: account.token_type ?? undefined,
                        scope: account.scope ?? undefined,
                        id_token: account.id_token ?? undefined,
                    },
                },
            },
        });
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message.includes("Unique constraint")
        ) {
            const byLogin = githubLogin
                ? await prisma.user.findUnique({ where: { githubLogin } })
                : null;
            const byEmail = email
                ? await prisma.user.findUnique({ where: { email } })
                : null;
            const foundUser = byLogin ?? byEmail;
            if (foundUser) {
                return foundUser;
            }
        }
        throw error;
    }
}
