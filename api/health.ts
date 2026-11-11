import { getGeminiClient, CANDIDATE_MODELS } from "./_lib/gemini.js";

export default async function handler(req: any, res: any) {
  const base = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "aura-numerology-vercel-serverless",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  };
  if (!req.query || req.query.probe !== "1") {
    return res.status(200).json(base);
  }
  const ai = getGeminiClient();
  const results: any[] = [];
  if (ai) {
    for (const model of CANDIDATE_MODELS) {
      try {
        const r: any = await ai.models.generateContent({ model, contents: "Trả lời đúng một chữ: OK" });
        results.push({
          model,
          ok: true,
          text: (r?.text || "").slice(0, 50),
          finishReason: r?.candidates?.[0]?.finishReason,
          blockReason: r?.promptFeedback?.blockReason,
        });
      } catch (err: any) {
        results.push({ model, ok: false, status: err?.status, error: String(err?.message || err).slice(0, 300) });
      }
    }
  }
  return res.status(200).json({ ...base, probe: results });
}
