import { getCanonicalSiteUrl } from "@/lib/site-url";
import { SITE_GITHUB_URL, SITE_OWNER_NAME } from "@/lib/site-owner";

export default function JsonLd() {
    const baseUrl = getCanonicalSiteUrl();

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "RepoMind",
                    alternateName: ["RepoMind AI", "repomind"],
                    url: baseUrl,
                    author: {
                        "@type": "Person",
                        name: SITE_OWNER_NAME,
                        url: SITE_GITHUB_URL,
                    },
                }),
            }}
        />
    );
}
