export type ParsedGitHubInput =
    | { kind: "profile"; username: string }
    | { kind: "repo"; owner: string; repo: string }
    | { kind: "invalid" };

const SEGMENT = /^[A-Za-z0-9._-]{1,100}$/;

function cleanSegment(value: string): string {
    return value.replace(/\.git$/i, "");
}

function isValidSegment(value: string): boolean {
    if (!SEGMENT.test(value)) return false;
    if (value.startsWith(".") || value.endsWith(".")) return false;
    return true;
}

function toRepo(owner: string, repoRaw: string): ParsedGitHubInput {
    const repo = cleanSegment(repoRaw);
    if (!isValidSegment(owner) || !isValidSegment(repo)) {
        return { kind: "invalid" };
    }
    return { kind: "repo", owner, repo };
}

/**
 * Accepts username, owner/repo, GitHub HTTPS/SSH clone URLs, and repo pages.
 */
export function parseGitHubInput(raw: string): ParsedGitHubInput {
    let value = raw.trim().replace(/^['"]+|['"]+$/g, "");
    if (!value) return { kind: "invalid" };

    const sshMatch = value.match(/^git@github\.com:([^/]+)\/(.+)$/i);
    if (sshMatch) {
        return toRepo(sshMatch[1], sshMatch[2]);
    }

    value = value.replace(/^https?:\/\//i, "");
    value = value.replace(/^www\./i, "");
    value = value.replace(/^github\.com\//i, "");
    value = value.split(/[?#]/)[0].replace(/\/+$/, "");

    const parts = value.split("/").filter(Boolean);
    if (parts.length === 0) return { kind: "invalid" };

    if (parts.length === 1) {
        const username = cleanSegment(parts[0]);
        if (!isValidSegment(username)) return { kind: "invalid" };
        return { kind: "profile", username };
    }

    return toRepo(parts[0], parts[1]);
}

export function toGitHubQuery(parsed: ParsedGitHubInput): string | null {
    if (parsed.kind === "profile") return parsed.username;
    if (parsed.kind === "repo") return `${parsed.owner}/${parsed.repo}`;
    return null;
}
