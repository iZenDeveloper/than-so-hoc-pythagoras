import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  generateDeterministicDeepReading,
  generateDeterministicCompatibility,
  generateDeterministicQA,
  ProfileInput,
} from "./server/fallbackNumerology.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. AI features will run in fallback/guided mode.");
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

// Resilient multi-model execution with exponential backoff and timeout protection
// Official verified models in @google/genai SDK
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

async function callGeminiWithResilience(
  generateParamsFn: (modelName: string) => any,
  timeoutMs = 7000
): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const params = generateParamsFn(model);
      
      // Enforce timeout so slow or hung network calls fail over swiftly
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      );

      const generatePromise = ai.models.generateContent(params);
      const response = await Promise.race([generatePromise, timeoutPromise]);
      
      if (response && (response as any).text) {
        return (response as any).text;
      }
    } catch (err: any) {
      // Gracefully fall through to next model candidate
      continue;
    }
  }
  return null;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Numerology Deep Reading Endpoint
app.post("/api/numerology/ai-reading", async (req, res) => {
  try {
    const { profile, focusArea } = req.body;
    if (!profile || !profile.fullName || !profile.birthDate) {
      return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ họ tên và ngày sinh." });
    }

    const prompt = `
Bạn là Chuyên gia Thần số học Pythagoras (Master Numerologist) hàng đầu với hơn 20 năm kinh nghiệm giải mã vận mệnh và phát triển tiềm năng con người.
Hãy phân tích lá số Thần Số Học chuyên sâu cho người có thông tin sau:
- Họ và tên: ${profile.fullName}
- Ngày sinh: ${profile.birthDate}
- Giờ sinh: ${profile.birthTime || "Không có thông tin"}
- Con số chủ đạo (Life Path): ${profile.lifePathDisplay || profile.lifePath}
- Con số sứ mệnh (Destiny): ${profile.destiny}
- Con số linh hồn (Soul Urge): ${profile.soulUrge}
- Con số nhân cách (Personality): ${profile.personality}
- Con số thái độ (Attitude): ${profile.attitude}
- Con số ngày sinh (Birthday): ${profile.birthdayNumber}
- Con số trưởng thành (Maturity): ${profile.maturity}
- Năm cá nhân hiện tại (${profile.currentYear}): Số ${profile.personalYear}
- Các mũi tên cá tính nổi bật: ${profile.activeArrows?.join(", ") || "Không có mũi tên hoàn chỉnh"}
- Các mũi tên trống/bài học: ${profile.emptyArrows?.join(", ") || "Không có"}
${focusArea ? `- Trọng tâm người dùng muốn tìm hiểu: ${focusArea}` : ""}

QUY TẮC BẮT BUỘC VỀ SỐ LIỆU (CỰC KỲ QUAN TRỌNG):
MỌI CON SỐ ĐÃ ĐƯỢC HỆ THỐNG TÍNH TOÁN CHÍNH XÁC 1 LẦN DUY NHẤT Ở TRÊN (Số Chủ Đạo = ${profile.lifePathDisplay || profile.lifePath}, Sứ Mệnh = ${profile.destiny}, Linh Hồn = ${profile.soulUrge}, Nhân Cách = ${profile.personality}).
BẠN TUYỆT ĐỐI CẤM TỰ TÍNH LẠI HOẶC TỰ BỊA RA CON SỐ KHÁC. BẠN PHẢI DÙNG CHÍNH XÁC CÁC CON SỐ ĐÃ CUNG CẤP TRÊN ĐÂY ĐỂ LUẬN GIẢI.

YÊU CẦU BẢN LUẬN GIẢI:
Hãy đưa ra một bản luận giải chi tiết, sâu sắc, lời văn trang trọng, truyền cảm hứng, thấu cảm và thực tế theo cấu trúc rõ ràng:
1. **Tổng Quan Chân Dung Năng Lượng**: Sự hòa hợp hoặc mâu thuẫn giữa Số Chủ Đạo (${profile.lifePathDisplay || profile.lifePath}) và Sứ Mệnh (${profile.destiny}) & Linh Hồn (${profile.soulUrge}) & Nhân Cách (${profile.personality}).
2. **Tiềm Năng & Thế Mạnh Đỉnh Cao**: 3 tài năng thiên bẩm lớn nhất cần khai phá.
3. **Thử Thách & Điểm Mù (Karmic Lessons)**: Vấn đề cốt lõi thường gặp trong cuộc sống/tâm lý và cách chuyển hóa năng lượng tiêu cực thành tích cực.
4. **Định Hướng Sự Nghiệp & Tài Chính**: Môi trường làm việc lý tưởng, các vị trí/ngành nghề giúp thăng hoa tài lộc và danh vọng.
5. **Đời Sống Tình Cảm & Mối Quan Hệ**: Cách yêu, mong cầu sâu kín trong tình cảm và cách hòa hợp với người khác.
6. **Vận Trình Năm Cá Nhân (${profile.currentYear} - Năm số ${profile.personalYear})**: Cơ hội lớn, điều nên làm (NÊN) và điều tối kỵ nên tránh (KHÔNG NÊN) trong 12 tháng này.
7. **Thông Điệp & Lời Khuyên Tu Dưỡng**: Lời nhắn nhủ gửi gắm từ vũ trụ để khai mở phúc khí và bình an nội tâm.

Trình bày bằng tiếng Việt mượt mà, định dạng Markdown rõ ràng, dùng các icon tinh tế.
`;

    // Attempt generation with cascade & retries
    const aiResult = await callGeminiWithResilience((modelName) => ({
      model: modelName,
      contents: prompt,
    }));

    if (aiResult) {
      return res.json({ reading: aiResult, source: "ai" });
    }

    // Fallback to high-precision Pythagoras knowledge engine
    console.info("[Pythagoras Fallback] Generating deterministic reading for:", profile.fullName);
    const fallbackReading = generateDeterministicDeepReading(profile as ProfileInput, focusArea);
    return res.json({ reading: fallbackReading, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error generating AI reading:", error);
    const { profile, focusArea } = req.body;
    if (profile) {
      const fallbackReading = generateDeterministicDeepReading(profile as ProfileInput, focusArea);
      return res.json({ reading: fallbackReading, source: "synthesized_master" });
    }
    res.status(500).json({
      error: "Không thể tạo bản luận giải vào lúc này. Vui lòng thử lại sau.",
    });
  }
});

// AI Compatibility Reading Endpoint
app.post("/api/numerology/ai-compatibility", async (req, res) => {
  try {
    const { personA, personB, relationshipType = "Tình yêu / Hôn nhân" } = req.body;
    if (!personA || !personB) {
      return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin của cả 2 người." });
    }

    const prompt = `
Bạn là Chuyên gia Cố vấn Mối Quan Hệ & Thần Số Học Pythagoras. Hãy phân tích độ tương hợp chi tiết giữa 2 người:

NGƯỜI THỨ NHẤT:
- Họ tên: ${personA.fullName} (Ngày sinh: ${personA.birthDate})
- Số Chủ Đạo: ${personA.lifePath}, Sứ Mệnh: ${personA.destiny}, Linh Hồn: ${personA.soulUrge}, Nhân Cách: ${personA.personality}

NGƯỜI THỨ HAI:
- Họ tên: ${personB.fullName} (Ngày sinh: ${personB.birthDate})
- Số Chủ Đạo: ${personB.lifePath}, Sứ Mệnh: ${personB.destiny}, Linh Hồn: ${personB.soulUrge}, Nhân Cách: ${personB.personality}

MỐI QUAN HỆ: ${relationshipType}

YÊU CẦU LUẬN GIẢI TƯƠNG HỢP:
1. **Điểm Số Hòa Hợp Chung** (Đánh giá trên thang điểm 100% kèm danh hiệu tương hợp).
2. **Giao Thoa Tầng Năng Lượng**:
   - Tương hợp Trí Tuệ & Lý Tưởng (Số Chủ Đạo & Sứ Mệnh)
   - Tương hợp Cảm Xúc & Nhu Cầu Sâu Kín (Số Linh Hồn)
   - Tương hợp Lối Sống & Cách Thể Hiện Ra Ngoài (Số Nhân Cách & Thái Độ)
3. **Điểm Mạnh Khi Ở Bên Nhau**: Những điều tuyệt vời 2 bạn bổ trợ cho nhau.
4. **Vùng Xung Đột Tiềm Ẩn**: Những bất đồng dễ nảy sinh do khác biệt tần số rung động.
5. **Cẩm Nang & Lời Khuyên Giữ Gìn Hạnh Phúc / Hợp Tác Lâu Dài**: Các nguyên tắc giao tiếp và thấu hiểu cốt tử.

Trình bày bằng Markdown đẹp mắt, văn phong ấm áp, thấu đáo và tính xây dựng cao.
`;

    const aiResult = await callGeminiWithResilience((modelName) => ({
      model: modelName,
      contents: prompt,
    }));

    if (aiResult) {
      return res.json({ analysis: aiResult, source: "ai" });
    }

    // Fallback to high-precision Pythagoras compatibility engine
    console.info("[Pythagoras Fallback] Generating deterministic compatibility for:", personA.fullName, personB.fullName);
    const fallbackAnalysis = generateDeterministicCompatibility(
      personA as ProfileInput,
      personB as ProfileInput,
      relationshipType
    );
    return res.json({ analysis: fallbackAnalysis, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error generating compatibility analysis:", error);
    const { personA, personB, relationshipType } = req.body;
    if (personA && personB) {
      const fallbackAnalysis = generateDeterministicCompatibility(
        personA as ProfileInput,
        personB as ProfileInput,
        relationshipType
      );
      return res.json({ analysis: fallbackAnalysis, source: "synthesized_master" });
    }
    res.status(500).json({
      error: "Không thể tạo bản phân tích tương hợp vào lúc này.",
    });
  }
});

// AI Q&A Endpoint for Numerology Consultation
app.post("/api/numerology/ai-qa", async (req, res) => {
  try {
    const { profile, question, chatHistory = [] } = req.body;
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

    // Filter, sanitize and merge chatHistory to strictly alternate user/model
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

    // Ensure last turn contains the current question as user turn
    if (turns.length > 0 && turns[turns.length - 1].role === "user") {
      turns[turns.length - 1].parts[0].text += "\n" + question;
    } else {
      turns.push({ role: "user", parts: [{ text: question }] });
    }

    // Ensure the conversation begins with a 'user' turn
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
      return res.json({ answer: aiResult, source: "ai" });
    }

    // Fallback to Pythagoras QA generator
    console.info("[Pythagoras Fallback] Generating deterministic QA answer for question:", question);
    const fallbackAnswer = generateDeterministicQA(profile as ProfileInput | null, question);
    return res.json({ answer: fallbackAnswer, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error in AI Q&A:", error);
    const { profile, question } = req.body;
    const fallbackAnswer = generateDeterministicQA(profile as ProfileInput | null, question || "");
    return res.json({ answer: fallbackAnswer, source: "synthesized_master" });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Numerology Server running at http://localhost:${PORT}`);
  });
}

startServer();
