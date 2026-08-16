/**
 * Unified Gemini AI client factory.
 *
 * Single source of truth for API key validation and model configuration.
 * All AI calls in the codebase must go through this module — never
 * instantiate GoogleGenerativeAI directly in feature code.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

/**
 * Returns a lazy-initialized GoogleGenerativeAI singleton.
 * Throws a clear, actionable error at call time if the API key is missing,
 * rather than passing an empty string and getting a silent 401.
 */
export function getGenAI(): GoogleGenerativeAI {
    if (_genAI) return _genAI;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(
            "[RepoMind] GEMINI_API_KEY environment variable is not set. " +
            "Add it to your .env.local file or deployment environment secrets."
        );
    }

    _genAI = new GoogleGenerativeAI(apiKey);
    return _genAI;
}

/** Supported model preferences for the user interface */
export type ModelPreference = "flash" | "thinking";

const FALLBACK_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-2.5-flash-lite",
] as const;

export function getDefaultModel(): string {
    return process.env.GEMINI_MODEL?.trim() || FALLBACK_MODELS[0];
}

export function getThinkingModel(): string {
    return process.env.GEMINI_THINKING_MODEL?.trim() || getDefaultModel();
}

export function resolveModelName(preference: ModelPreference = "flash"): string {
    return preference === "thinking" ? getThinkingModel() : getDefaultModel();
}

/** Default chat/analysis model. Override with GEMINI_MODEL. */
export const DEFAULT_MODEL = getDefaultModel();

export function isGoogleSearchEnabled(modelName: string = getDefaultModel()): boolean {
    const flag = process.env.ENABLE_GEMINI_GOOGLE_SEARCH?.trim().toLowerCase();
    if (flag === "false" || flag === "0") return false;
    if (flag === "true" || flag === "1") return true;
    return false;
}

function shouldTryNextModel(error: unknown): boolean {
    const message =
        error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string"
            ? (error as { message: string }).message.toLowerCase()
            : String(error).toLowerCase();
    const status =
        error && typeof error === "object" && "status" in error && typeof (error as { status?: unknown }).status === "number"
            ? (error as { status: number }).status
            : undefined;

    return (
        status === 404 ||
        status === 429 ||
        message.includes("not found") ||
        message.includes("not supported") ||
        message.includes("quota") ||
        message.includes("resource_exhausted") ||
        message.includes("rate limit")
    );
}

export function modelCandidates(preference: ModelPreference = "flash"): string[] {
    const primary = resolveModelName(preference);
    return [primary, ...FALLBACK_MODELS.filter((name) => name !== primary)];
}

export async function withModelFallback<T>(
    run: (modelName: string) => Promise<T>,
    preference: ModelPreference = "flash",
): Promise<T> {
    let lastError: unknown;
    for (const modelName of modelCandidates(preference)) {
        try {
            return await run(modelName);
        } catch (error) {
            lastError = error;
            if (!shouldTryNextModel(error)) {
                throw error;
            }
            console.warn(`[RepoMind] Gemini model ${modelName} failed, trying next:`, error);
        }
    }
    throw lastError;
}
