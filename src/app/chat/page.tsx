import { ProfileLoader } from "@/components/ProfileLoader";
import { RepoLoader } from "@/components/RepoLoader";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: {
        canonical: "/chat",
    },
};

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; prompt?: string }>;
}) {
    const { q: query, prompt } = await searchParams;

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black gap-4 p-4">
                <Search className="w-12 h-12" />
                <h1 className="font-display text-3xl">No Query Provided</h1>
                <p className="text-neutral-600 text-center">Please search for a GitHub user or repository</p>
                <Link href="/" className="mt-4 px-6 py-3 bg-black text-white text-xs font-bold tracking-[0.18em] uppercase rounded-full flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        );
    }

    // If it's a profile query (no slash), load immediately with ProfileLoader
    if (!query.includes("/")) {
        return <ProfileLoader username={query} />;
    }

    // For repos, use RepoLoader for client-side loading
    return <RepoLoader query={query} initialPrompt={prompt} />;
}
