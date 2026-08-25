import NextAuth from "next-auth";
import { linkGithubOAuthUser } from "./auth-oauth-db";
import { queueWelcomeEmailDelivery } from "./emails/delivery-service";
import authConfig from "./auth.config";
import { prisma } from "./db";
import { INVALID_SESSION_ERROR_CODE } from "./session-guard";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ account, profile }) {
            if (account?.provider !== "github") {
                return true;
            }

            try {
                const dbUser = await linkGithubOAuthUser(account, profile);
                if (dbUser?.email) {
                    const username =
                        dbUser.githubLogin ||
                        dbUser.name ||
                        dbUser.email.split("@")[0];
                    queueWelcomeEmailDelivery({
                        userId: dbUser.id,
                        toEmail: dbUser.email,
                        username: String(username),
                    }).catch((error: unknown) => {
                        console.error("[auth] Failed to queue welcome email:", error);
                    });
                }
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : String(error);
                console.error("[auth] GitHub sign-in database error:", message);
                return `/auth/error?error=Configuration&details=${encodeURIComponent(message)}`;
            }

            return true;
        },
        async jwt({ token, profile, account }) {
            if (account?.provider === "github" && account.providerAccountId) {
                try {
                    const providerAccountId = String(account.providerAccountId);
                    const linked = await prisma.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: "github",
                                providerAccountId,
                            },
                        },
                        include: { user: true },
                    });
                    if (linked?.user) {
                        token.id = linked.user.id;
                        if (linked.user.githubLogin) {
                            token.username = linked.user.githubLogin;
                        }
                    }
                } catch (error: unknown) {
                    const message =
                        error instanceof Error ? error.message : String(error);
                    console.error("[auth] jwt account lookup failed:", message);
                }
            }

            const next = authConfig.callbacks?.jwt;
            if (typeof next === "function") {
                return next({
                    token,
                    profile,
                    account,
                    user: undefined,
                    trigger: "update",
                    session: null,
                    isNewUser: false,
                } as never);
            }

            if (!token.id && typeof token.sub === "string") {
                token.id = token.sub;
            }
            if (!token.id) {
                token.error = INVALID_SESSION_ERROR_CODE;
            }
            return token;
        },
    },
});
