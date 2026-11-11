import { callGeminiWithResilience } from "../_lib/gemini.js";
import { generateDeterministicCompatibility, ProfileInput } from "../../src/utils/fallbackNumerology.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { personA, personB, relationshipType = "Tình yêu / Hôn nhân" } = body;

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

QUY TẮC BẮT BUỘC: Sử dụng đúng các con số năng lượng đã cung cấp, không tự tính lại số liệu.

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
      return res.status(200).json({ analysis: aiResult, source: "ai" });
    }

    const fallbackAnalysis = generateDeterministicCompatibility(
      personA as ProfileInput,
      personB as ProfileInput,
      relationshipType
    );
    return res.status(200).json({ analysis: fallbackAnalysis, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error in ai-compatibility function:", error);
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (body.personA && body.personB) {
        const fallback = generateDeterministicCompatibility(body.personA, body.personB, body.relationshipType);
        return res.status(200).json({ analysis: fallback, source: "synthesized_master" });
      }
    } catch (_) {}
    return res.status(500).json({ error: "Không thể phân tích tương hợp lúc này." });
  }
}
