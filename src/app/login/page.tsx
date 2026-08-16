import { Suspense } from "react";
import { getGitHubOAuthConfigError } from "@/lib/auth-env";
import { LoginForm } from "./LoginForm";
import SiteHeader from "@/components/SiteHeader";

interface LoginPageProps {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}

async function LoginPanel({ callbackUrl }: { callbackUrl: string }) {
    const configError = getGitHubOAuthConfigError();

    return <LoginForm callbackUrl={callbackUrl} configError={configError} />;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const callbackUrl = params.callbackUrl ?? "/";

    return (
        <main className="min-h-screen bg-white text-black">
            <SiteHeader />
            <div className="flex items-center justify-center p-6 py-16">
                <Suspense
                    fallback={
                        <div className="w-full max-w-md border-2 border-black bg-white p-8">
                            <p className="text-neutral-600">Loading…</p>
                        </div>
                    }
                >
                    <LoginPanel callbackUrl={callbackUrl} />
                </Suspense>
            </div>
        </main>
    );
}
