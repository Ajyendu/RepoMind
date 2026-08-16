"use client";

import { BrandMark } from "@/components/BrandMark";
import AuthButton from "@/components/AuthButton";
import { GitHubBadge } from "@/components/GitHubBadge";

export default function SiteHeader({
    showAuth = true,
}: {
    showAuth?: boolean;
}) {
    return (
        <header className="sticky top-0 z-50 bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
                <BrandMark />
                {showAuth ? (
                    <div className="ml-auto flex items-center gap-3">
                        <GitHubBadge />
                        <AuthButton />
                    </div>
                ) : null}
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="rule-with-dots" />
            </div>
        </header>
    );
}
