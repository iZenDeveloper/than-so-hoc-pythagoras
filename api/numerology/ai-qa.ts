import { callGeminiWithResilience } from "../_lib/gemini.js";
import { generateDeterministicQA, ProfileInput } from "../../src/utils/fallbackNumerology.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { profile, question, chatHistory = [] } = body;

    if (!question) {
      return res.status(400).json({ error: "Vui lòng nhập câu hỏi của bạn." });
    }

    const systemPrompt = `
Bạn là Cố Vấn Thần Số Học Trực Tuyến thông thái, ân cần và giàu trải nghiệm.
Hồ sơ thần số học của người đang trò chuyện với bạn:
${
  profile
    ? `
- Họ và tên: ${profile.fullName}
- Ngày sinh: ${profile.birthDate}
- Giờ sinh: ${profile.birthTime || "Không có thông tin"}
- Số Chủ Đạo: ${profile.lifePathDisplay || profile.lifePath}
- Số Sứ Mệnh: ${profile.destiny}
- Số Linh Hồn: ${profile.soulUrge}
- Số Nhân Cách: ${profile.personality}
- Số Thái Độ: ${profile.attitude}
- Năm cá nhân hiện tại: ${profile.personalYear}

QUY TẮC BẮT BUỘC: Bạn phải dùng ĐÚNG các con số đã được tính toán ở trên. Tuyệt đối không tự tính lại số liệu hay thay đổi các con số đã cho.
`
    : "Người dùng chưa nhập hồ sơ đầy đủ, hãy trả lời câu hỏi thần số học tổng quát hoặc khuyến khích họ nhập ngày sinh để giải đáp chính xác nhất."
}

Hãy lắng nghe câu hỏi của họ, sử dụng kiến thức chuẩn Pythagoras kết hợp tâm lý học tích cực để đưa ra câu trả lời thấu đáo, truyền cảm hứng và đưa ra lời khuyên hành động thực tế. Giữ câu trả lời súc tích, mạch lạc (khoảng 200 - 350 từ).
`;

    const turns: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        if (!msg || !msg.content || typeof msg.content !== "string") continue;
        const role: "user" | "model" = msg.role === "assistant" ? "model" : "user";
        if (turns.length > 0 && turns[turns.length - 1].role === role) {
          turns[turns.length - 1].parts[0].text += "\n" + msg.content;
        } else {
          turns.push({ role, parts: [{ text: msg.content }] });
        }
      }
    }

    if (turns.length > 0 && turns[turns.length - 1].role === "user") {
      turns[turns.length - 1].parts[0].text += "\n" + question;
    } else {
      turns.push({ role: "user", parts: [{ text: question }] });
    }

    while (turns.length > 0 && turns[0].role !== "user") {
      turns.shift();
    }
    if (turns.length === 0) {
      turns.push({ role: "user", parts: [{ text: question }] });
    }

    const aiResult = await callGeminiWithResilience((modelName) => ({
      model: modelName,
      contents: turns,
      config: {
        systemInstruction: systemPrompt,
      },
    }));

    if (aiResult) {
      return res.status(200).json({ answer: aiResult, source: "ai" });
    }

    const fallbackAnswer = generateDeterministicQA(profile as ProfileInput | null, question);
    return res.status(200).json({ answer: fallbackAnswer, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error in ai-qa function:", error);
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const fallback = generateDeterministicQA(body.profile as ProfileInput | null, body.question || "");
      return res.status(200).json({ answer: fallback, source: "synthesized_master" });
    } catch (_) {}
    return res.status(500).json({ error: "Không thể kết nối máy chủ AI." });
  }
}
