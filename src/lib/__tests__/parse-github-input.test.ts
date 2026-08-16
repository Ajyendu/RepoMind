import { describe, expect, it } from "vitest";
import { parseGitHubInput, toGitHubQuery } from "@/lib/parse-github-input";

describe("parseGitHubInput", () => {
    it("parses owner/repo", () => {
        expect(parseGitHubInput("Ajyendu/Health-Cura")).toEqual({
            kind: "repo",
            owner: "Ajyendu",
            repo: "Health-Cura",
        });
    });

    it("parses HTTPS clone URLs with .git", () => {
        expect(parseGitHubInput("https://github.com/Ajyendu/Health-Cura.git")).toEqual({
            kind: "repo",
            owner: "Ajyendu",
            repo: "Health-Cura",
        });
    });

    it("parses github.com URLs with extra path and trailing slash", () => {
        expect(parseGitHubInput("https://github.com/Ajyendu/Health-Cura/tree/main/")).toEqual({
            kind: "repo",
            owner: "Ajyendu",
            repo: "Health-Cura",
        });
    });

    it("parses SSH clone URLs", () => {
        expect(parseGitHubInput("git@github.com:Ajyendu/Health-Cura.git")).toEqual({
            kind: "repo",
            owner: "Ajyendu",
            repo: "Health-Cura",
        });
    });

    it("parses a username as a profile", () => {
        expect(parseGitHubInput("Ajyendu")).toEqual({
            kind: "profile",
            username: "Ajyendu",
        });
    });

    it("rejects empty input", () => {
        expect(parseGitHubInput("   ")).toEqual({ kind: "invalid" });
    });
});

describe("toGitHubQuery", () => {
    it("returns owner/repo for repo input", () => {
        expect(toGitHubQuery(parseGitHubInput("https://github.com/Ajyendu/Health-Cura.git"))).toBe(
            "Ajyendu/Health-Cura",
        );
    });
});
