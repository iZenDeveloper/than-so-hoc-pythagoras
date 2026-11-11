import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Running in deterministic fallback mode.");
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

export const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

export async function callGeminiWithResilience(
  generateParamsFn: (modelName: string) => any,
  timeoutMs = 25000
): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const params = generateParamsFn(model);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      );

      const generatePromise = ai.models.generateContent(params);
      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response && (response as any).text) {
        return (response as any).text;
      }
    } catch (err: any) {
      console.error(`[gemini] ${model} failed:`, err?.status || "", err?.message || err);
      continue;
    }
  }
  return null;
}
