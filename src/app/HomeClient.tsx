"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { fetchGitHubData } from "./actions";
import { parseGitHubInput, toGitHubQuery } from "@/lib/parse-github-input";
import InteractiveDemo from "@/components/InteractiveDemo";
import BentoFeatures from "@/components/BentoFeatures";
import CAGComparison from "@/components/CAGComparison";
import { InstallPWA } from "@/components/InstallPWA";
import AuthButton from "@/components/AuthButton";
import { INVALID_SESSION_ERROR_PARAM } from "@/lib/session-guard";
import { BlogPost } from "@prisma/client";
import { SITE_GITHUB_URL, SITE_OWNER_NAME } from "@/lib/site-owner";
import Footer from "@/components/Footer";
import { GitHubBadge } from "@/components/GitHubBadge";
import { BrandMark, DottedO } from "@/components/BrandMark";

export default function HomeClient({ initialPosts = [] }: { initialPosts?: BlogPost[] }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasInvalidSessionError = searchParams.get("error") === INVALID_SESSION_ERROR_PARAM;

    const analyze = async (raw: string) => {
        if (!raw.trim()) return;
        setLoading(true);
        setError("");
        try {
            const parsed = parseGitHubInput(raw);
            const query = toGitHubQuery(parsed);
            if (!query) {
                setError("Invalid input format. Use owner/repo or a GitHub URL.");
                return;
            }
            const result = await fetchGitHubData(query);
            if (result.error) {
                setError(result.error);
            } else {
                router.push(`/chat?q=${encodeURIComponent(query)}`);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-white text-black">
            <header className="sticky top-0 z-50 bg-white">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
                    <BrandMark />
                    <div className="ml-auto flex items-center gap-3">
                        <GitHubBadge />
                        <AuthButton />
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="rule-with-dots" />
                </div>
            </header>

            <section id="analyze" className="max-w-6xl mx-auto w-full px-4 md:px-6 py-10 md:py-16 flex flex-col items-center">
                <h1 className="font-brand wordmark-shadow text-[14vw] leading-[0.82] tracking-[-0.06em] uppercase text-center select-none">
                    Rep<DottedO />Mind
                </h1>

                <div className="w-full max-w-xl mt-10 md:mt-12">
                    {hasInvalidSessionError && (
                        <div className="mb-6 border-2 border-black px-4 py-3 text-sm">
                            Your session could not be validated. Please sign in again.
                        </div>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            void analyze(input);
                        }}
                        className="border-2 border-dashed border-black p-5 md:p-6"
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <p className="font-display text-2xl leading-tight">Analyze a repository</p>
                                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-[0.16em]">Paste owner/repo or a GitHub URL</p>
                            </div>
                            <Mail className="w-10 h-10 shrink-0" strokeWidth={1.25} />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="owner/repo or GitHub URL"
                                className="flex-1 border-b-2 border-black bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400"
                                suppressHydrationWarning
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white text-xs font-bold tracking-[0.18em] uppercase px-5 py-3 hover:bg-neutral-800 disabled:opacity-50"
                                suppressHydrationWarning
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Open"}
                            </button>
                        </div>
                        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
                    </form>
                </div>
            </section>

            <section id="demo" className="border-t-2 border-black">
                <InteractiveDemo />
            </section>

            <div className="border-t-2 border-black">
                <CAGComparison />
            </div>

            <div id="features" className="border-t-2 border-black">
                <BentoFeatures />
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "RepoMind",
                        "applicationCategory": "DeveloperApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD",
                        },
                        "description": "RepoMind is an AI-powered platform for codebase mastery, enabling developers to analyze, visualize, and chat with any GitHub repository or profile instantly.",
                        "author": {
                            "@type": "Person",
                            "name": SITE_OWNER_NAME,
                            "url": SITE_GITHUB_URL,
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "120",
                        },
                    }),
                }}
            />
            <Footer />
            <InstallPWA />
        </main>
    );
}
