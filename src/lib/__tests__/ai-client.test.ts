import { afterEach, describe, expect, it } from "vitest";
import { getDefaultModel, modelCandidates, withModelFallback } from "@/lib/ai-client";

describe("modelCandidates", () => {
    afterEach(() => {
        delete process.env.GEMINI_MODEL;
    });

    it("starts with GEMINI_MODEL when set", () => {
        process.env.GEMINI_MODEL = "gemini-2.0-flash-lite";
        expect(modelCandidates()[0]).toBe("gemini-2.0-flash-lite");
        expect(getDefaultModel()).toBe("gemini-2.0-flash-lite");
    });
});

describe("withModelFallback", () => {
    it("tries the next model after a quota error", async () => {
        const tried: string[] = [];
        const result = await withModelFallback(async (modelName) => {
            tried.push(modelName);
            if (tried.length === 1) {
                throw Object.assign(new Error("quota exceeded"), { status: 429 });
            }
            return modelName;
        });
        expect(tried.length).toBeGreaterThan(1);
        expect(result).toBe(tried[1]);
    });
});
