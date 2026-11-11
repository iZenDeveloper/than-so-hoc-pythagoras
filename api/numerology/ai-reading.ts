import { callGeminiWithResilience } from "../_lib/gemini.js";
import { generateDeterministicDeepReading, ProfileInput } from "../../src/utils/fallbackNumerology.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { profile, focusArea } = body;

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

    const aiResult = await callGeminiWithResilience((modelName) => ({
      model: modelName,
      contents: prompt,
    }));

    if (aiResult) {
      return res.status(200).json({ reading: aiResult, source: "ai" });
    }

    const fallbackReading = generateDeterministicDeepReading(profile as ProfileInput, focusArea);
    return res.status(200).json({ reading: fallbackReading, source: "synthesized_master" });
  } catch (error: any) {
    console.error("Error in ai-reading function:", error);
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (body.profile) {
        const fallback = generateDeterministicDeepReading(body.profile as ProfileInput, body.focusArea);
        return res.status(200).json({ reading: fallback, source: "synthesized_master" });
      }
    } catch (_) {}
    return res.status(500).json({ error: "Không thể tạo bản luận giải lúc này." });
  }
}
