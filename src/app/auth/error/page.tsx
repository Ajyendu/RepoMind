import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const ERROR_COPY: Record<
    string,
    { title: string; description: string; hint?: string }
> = {
    Configuration: {
        title: "Sign-in could not be completed",
        description:
            "GitHub authorized the app, but the server could not finish creating your session.",
        hint: "Open /api/health — if the database is ok, sign in again at your production /login URL (not a preview URL). If it still fails, check deploy logs for lines starting with [auth].",
    },
    AccessDenied: {
        title: "Sign-in could not finish",
        description:
            "GitHub accepted your account, but this app could not create your user in the database.",
        hint: "Start Postgres (or run `npx prisma migrate deploy` against your Neon DATABASE_URL), then open /api/health and confirm database.ok is true. This is not an allowlist on your GitHub username.",
    },
    Verification: {
        title: "Verification failed",
        description: "The sign-in link expired or was already used. Try again.",
    },
    Default: {
        title: "Authentication error",
        description: "Something went wrong during sign-in. Please try again.",
    },
};

interface AuthErrorPageProps {
    searchParams: Promise<{ error?: string; details?: string }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
    const params = await searchParams;
    const errorKey = params.error ?? "Default";
    const copy = ERROR_COPY[errorKey] ?? ERROR_COPY.Default;
    const details = params.details;

    return (
        <main className="min-h-screen bg-white text-black">
            <SiteHeader />
            <div className="flex items-center justify-center p-6 py-16">
            <div className="w-full max-w-md border-2 border-black bg-white p-8">
                <h1 className="font-display text-2xl font-bold mb-2 text-red-700">
                    {copy.title}
                </h1>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {copy.description}
                </p>
                {details ? (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-mono break-all leading-snug">
                        <strong>Error details:</strong> {details}
                    </div>
                ) : null}
                {copy.hint ? (
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed border-2 border-black p-3">
                        {copy.hint}
                    </p>
                ) : null}
                <p className="text-xs text-gray-500 mb-6">
                    Error code: <code className="font-mono">{errorKey}</code>
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full text-center px-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Try signing in again
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-center text-gray-600 underline hover:text-gray-900"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
            </div>
        </main>
    );
}
