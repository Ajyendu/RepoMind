"use client";

import { useEffect, useState } from "react";

import { Github, Star } from "lucide-react";
import { fetchRepoDetails } from "@/app/actions";
import { SITE_OWNER_GITHUB, SITE_REPO_NAME } from "@/lib/site-owner";

interface RepoWithStars {
    stargazers_count: number;
}

function isRepoWithStars(data: unknown): data is RepoWithStars {
    return Boolean(
        data &&
        typeof data === "object" &&
        "stargazers_count" in data &&
        typeof (data as { stargazers_count?: unknown }).stargazers_count === "number"
    );
}

export function GitHubBadge() {
    const [stars, setStars] = useState<number | null>(null);

    const repoOwner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || SITE_OWNER_GITHUB;
    const repoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || SITE_REPO_NAME;
    const repoHref = repoOwner && repoName ? `https://github.com/${repoOwner}/${repoName}` : "#";

    useEffect(() => {
        if (!repoOwner || !repoName) return;
        const getStars = async () => {
            try {
                const data = await fetchRepoDetails(repoOwner, repoName);
                if (isRepoWithStars(data)) {
                    setStars(data.stargazers_count);
                }
            } catch (e) {
                console.error("Failed to fetch repo stars", e);
            }
        };
        getStars();
    }, [repoOwner, repoName]);

    return (
        <a
            href={repoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity cursor-pointer block"
        >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-black text-xs font-medium">
                <Github className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline text-sm">Star</span>
                {stars !== null ? (
                    <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-black ml-1 text-slate-600">
                        <span className="text-xs font-mono">{stars.toLocaleString()}</span>
                        <Star className="w-3 h-3 text-black fill-black" />
                    </div>
                ) : (
                    <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-black ml-1 animate-pulse">
                        <div className="w-8 h-3 bg-gray-300 rounded mx-1" />
                        <Star className="w-3 h-3 text-gray-400 fill-gray-400" />
                    </div>
                )}
            </div>
        </a>
    );
}
