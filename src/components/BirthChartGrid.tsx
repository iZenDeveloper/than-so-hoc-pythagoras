import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Wand2,
  CheckCircle2,
  Info,
  RotateCcw,
} from 'lucide-react';
import { NumerologyProfile, ArrowInfo } from '../types/numerology';
import { detectArrows, removeVietnameseTones, LETTER_VALUES } from '../utils/numerologyCalculator';

interface BirthChartGridProps {
  profile: NumerologyProfile;
}

const CELL_FREQUENCY_MEANINGS: Record<number, { title: string; zero: string; one: string; two: string; threePlus: string }> = {
  1: {
    title: 'Số 1 — Trục Thể Chất: Cái Tôi, Ngôn Ngữ & Bản Lĩnh Độc Lập',
    zero: 'Khuyết số 1 (Hiếm gặp ở thế kỷ 20, phổ biến thế kỷ 21): Cần rèn luyện sự tự tin, chủ động nêu chính kiến và đứng trên đôi chân mình.',
    one: 'Một số 1: Cân bằng tốt về cái tôi, tuy nhiên đôi khi khó diễn đạt trọn vẹn cảm xúc nội tâm thành lời nói.',
    two: 'Hai số 1 (11 - Tỷ lệ vàng): Khả năng biểu đạt ngôn từ tuyệt vời, nhìn nhận vấn đề đa chiều, khách quan và thấu tình đạt lý.',
    threePlus: 'Từ ba số 1 trở lên: Năng lượng cái tôi mạnh mẽ, hoạt ngôn hoặc nội tâm sâu sắc; cần tránh áp đặt quan điểm cá nhân.',
  },
  2: {
    title: 'Số 2 — Trục Tâm Hồn: Trực Giác, Sự Nhạy Cảm & Thấu Cảm',
    zero: 'Khuyết số 2: Cần học cách lắng nghe tinh tế hơn, rèn luyện sự kiên nhẫn và tránh vội vàng phán xét cảm xúc người khác.',
    one: 'Một số 2: Có trực giác nền tảng tốt, nhạy cảm vừa đủ để đồng cảm nhưng cần môi trường bình yên để phát huy.',
    two: 'Hai số 2 (22 - Cặp trực giác chuẩn): Giác quan nhạy bén hiếm có, đọc vị tâm lý người đối diện nhanh chóng và khéo léo.',
    threePlus: 'Từ ba số 2 trở lên: Quá nhạy cảm với lời nói xung quanh, dễ tổn thương nội tâm; cần học cách bảo vệ trường năng lượng.',
  },
  3: {
    title: 'Số 3 — Trục Trí Tuệ: Tư Duy Logic, Trí Nhớ & Sáng Tạo',
    zero: 'Khuyết số 3: Cần rèn luyện khả năng ghi nhớ có hệ thống, tránh suy nghĩ lan man hoặc cả tin.',
    one: 'Một số 3: Trí nhớ nhanh nhạy, tư duy linh hoạt, giữ được sự lạc quan và ham học hỏi suốt đời.',
    two: 'Hai số 3 (33): Trí tưởng tượng phong phú, tài năng văn chương, nghệ thuật hoặc hoạch định chiến lược sắc sảo.',
    threePlus: 'Từ ba số 3 trở lên: Tâm trí hoạt động liên tục, đôi khi suy diễn quá xa thực tế; cần neo tâm trí vào hành động cụ thể.',
  },
  4: {
    title: 'Số 4 — Trục Thể Chất: Kỷ Luật, Trật Tự & Thực Thực Tế',
    zero: 'Khuyết số 4: Dễ thiếu kiên nhẫn với các công việc tỉ mỉ; cần rèn luyện kỷ luật tài chính và quản lý thời gian.',
    one: 'Một số 4: Khéo tay, thực tế, thích sự rõ ràng ngăn nắp và có năng lực tổ chức công việc bài bản.',
    two: 'Hai số 4 (44): Chuẩn mực cao về độ chính xác, thẩm mỹ thực tiễn nhưng cần cân bằng giữa vật chất và tinh thần.',
    threePlus: 'Từ ba số 4 trở lên: Làm việc cực kỳ chăm chỉ nhưng dễ bị cuốn vào chi tiết vụn vặt hoặc nguyên tắc cứng nhắc.',
  },
  5: {
    title: 'Số 5 — Trục Tâm Hồn (Trung Tâm Ma Trận): Tự Do, Cảm Xúc & Kết Nối',
    zero: 'Khuyết số 5 (Mất điểm tựa trung tâm): Dễ ngại đám đông hoặc do dự trước thay đổi lớn; rất nên bổ sung chữ E, N, W trong danh xưng.',
    one: 'Một số 5 (Đẹp nhất): Trái tim cân bằng, giàu nghị lực, biết kiểm soát cảm xúc và truyền lửa ấm áp cho mọi người.',
    two: 'Hai số 5 (55): Nhiệt huyết mãnh liệt, ánh mắt sắc sảo, quyết tâm cao nhưng đôi khi tự tạo áp lực lớn cho bản thân.',
    threePlus: 'Từ ba số 5 trở lên: Cảm xúc bùng nổ mạnh, ưa mạo hiểm; cần học cách kiềm chế lời nói lúc nóng giận.',
  },
  6: {
    title: 'Số 6 — Trục Trí Tuệ: Tình Thương, Sáng Tạo & Mái Ấm',
    zero: 'Khuyết số 6: Cần chủ động bày tỏ tình cảm với người thân thay vì giữ trong lòng, học cách đón nhận sự quan tâm.',
    one: 'Một số 6: Yêu gia đình, có khiếu thẩm mỹ và nghệ thuật tự nhiên, luôn tạo cảm giác ấm áp cho tổ ấm.',
    two: 'Hai số 6 (66): Sáng tạo dồi dào nhưng dễ lo âu thái quá cho người thân; cần trao quyền tự lập cho con cái/đối phương.',
    threePlus: 'Từ ba số 6 trở lên: Dễ bao bọc quá mức hoặc cầu toàn trong tình cảm; hãy dành thời gian chăm sóc chính mình.',
  },
  7: {
    title: 'Số 7 — Trục Thể Chất: Trải Nghiệm, Tri Thức Sâu & Chiêm Nghiệm',
    zero: 'Khuyết số 7: Thường học qua sự dẫn dắt êm đềm hơn là biến cố lớn; cần chủ động dấn thân trải nghiệm thực tế.',
    one: 'Một số 7: Rút ra bài học sâu sắc sau mỗi lần thử thách, càng trưởng thành càng thông thái và điềm tĩnh.',
    two: 'Hai số 7 (77): Năng lực phân tích triết học và tâm linh bén nhạy, nhìn thấu bản chất sự việc.',
    threePlus: 'Từ ba số 7 trở lên: Cuộc đời nhiều bài học rèn luyện bản lĩnh lớn để trở thành bậc thầy khai sáng.',
  },
  8: {
    title: 'Số 8 — Trục Tâm Hồn: Trí Tuệ Cảm Xúc, Tài Chính & Độc Lập',
    zero: 'Khuyết số 8: Cần rèn luyện tư duy quản lý tài chính chủ động và tính tỉ mỉ trong các cam kết hợp đồng.',
    one: 'Một số 8: Có trách nhiệm, nhạy bén với cơ hội kinh doanh, cẩn trọng và có tư duy hệ thống.',
    two: 'Hai số 8 (88): Khả năng quan sát sắc bén, quyết đoán trong đầu tư và quản trị nguồn lực lớn.',
    threePlus: 'Từ ba số 8 trở lên: Khát vọng thành tựu cao, thích xê dịch và chinh phục những mục tiêu tài chính lớn.',
  },
  9: {
    title: 'Số 9 — Trục Trí Tuệ: Hoài Bão, Lý Tưởng & Lòng Nhân Đạo',
    zero: 'Khuyết số 9 (Phổ biến từ thế kỷ 21): Cần nuôi dưỡng ước mơ lớn và tinh thần phụng sự cộng đồng.',
    one: 'Một số 9: Có hoài bão rõ ràng, trọng chữ tín và luôn hướng tới việc nâng cao giá trị bản thân.',
    two: 'Hai số 9 (99): Lý tưởng cao đẹp, tư duy sắc sảo, luôn muốn cống hiến giá trị nhân văn cho xã hội.',
    threePlus: 'Từ ba số 9 trở lên: Lý tưởng hóa cao độ, cần gắn kết ước mơ lớn với kế hoạch hành động thực tế.',
  },
};

const LETTER_BY_NUM: Record<number, string> = {
  1: 'A, J, S',
  2: 'B, K, T',
  3: 'C, L, U',
  4: 'D, M, V',
  5: 'E, N, W',
  6: 'F, O, X',
  7: 'G, P, Y',
  8: 'H, Q, Z',
  9: 'I, R',
};

export const BirthChartGrid: React.FC<BirthChartGridProps> = ({ profile }) => {
  const [chartMode, setChartMode] = useState<'birth' | 'name' | 'combined'>('birth');
  const [selectedArrow, setSelectedArrow] = useState<ArrowInfo | null>(null);
  const [selectedCellNum, setSelectedCellNum] = useState<number>(5);
  const [nickname, setNickname] = useState<string>('');

  // Calculate extra letter counts from experimental nickname/brand name
  const nicknameCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  if (nickname.trim()) {
    const cleanNick = removeVietnameseTones(nickname.trim()).toUpperCase();
    for (const ch of cleanNick) {
      const val = LETTER_VALUES[ch];
      if (val) {
        nicknameCounts[val] = (nicknameCounts[val] || 0) + 1;
      }
    }
  }

  const baseCounts =
    chartMode === 'birth'
      ? profile.birthChartCounts
      : chartMode === 'name'
      ? profile.nameChartCounts
      : profile.combinedChartCounts;

  const activeCounts: Record<number, number> = { ...baseCounts };
  if (nickname.trim() && chartMode !== 'birth') {
    for (let i = 1; i <= 9; i++) {
      activeCounts[i] = (activeCounts[i] || 0) + (nicknameCounts[i] || 0);
    }
  }

  // Dynamically compute arrows & isolated numbers for the active chart mode!
  const currentDetection = detectArrows(activeCounts);
  const birthActiveCodes = new Set(profile.activeArrows.map((a) => a.code));

  // Missing numbers in the Birth Chart that could be compensated
  const missingInBirth = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !profile.birthChartCounts[n]);

  // Grid cells 3x3 layout (standard Pythagoras matrix):
  const gridRows = [
    [
      { num: 3, plane: 'Trí tuệ', meaning: 'Khả năng tư duy, học hỏi & trí nhớ' },
      { num: 6, plane: 'Trí tuệ', meaning: 'Tình yêu thương, sáng tạo & thẩm mỹ' },
      { num: 9, plane: 'Trí tuệ', meaning: 'Lý tưởng, nhân đạo & hoài bão' },
    ],
    [
      { num: 2, plane: 'Tâm hồn', meaning: 'Trực giác, sự nhạy cảm & hòa giải' },
      { num: 5, plane: 'Tâm hồn', meaning: 'Tình cảm, tự do & tình yêu biểu đạt' },
      { num: 8, plane: 'Tâm hồn', meaning: 'Trí tuệ tâm linh & độc lập kinh tế' },
    ],
    [
      { num: 1, plane: 'Thể chất', meaning: 'Cái tôi cá nhân, bản ngã & ngôn ngữ' },
      { num: 4, plane: 'Thể chất', meaning: 'Thực tế, kỷ luật, trật tự & vật chất' },
      { num: 7, plane: 'Thể chất', meaning: 'Bài học trải nghiệm, tri thức & hy sinh' },
    ],
  ];

  const selectedCellCount = activeCounts[selectedCellNum] || 0;
  const cellMeta = CELL_FREQUENCY_MEANINGS[selectedCellNum] || CELL_FREQUENCY_MEANINGS[5];
  const cellInterpretation =
    selectedCellCount === 0
      ? cellMeta.zero
      : selectedCellCount === 1
      ? cellMeta.one
      : selectedCellCount === 2
      ? cellMeta.two
      : cellMeta.threePlus;

  return (
    <div className="space-y-6">
      {/* Header & Chart Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Biểu Đồ Pythagoras & Mũi Tên Hình Học
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            Ma trận 3x3 thể hiện 3 trục năng lượng vũ trụ: Trí tuệ (3-6-9), Tâm hồn (2-5-8) và Thể chất (1-4-7). Nhấn vào từng ô số để xem luận giải tần suất.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 bg-[#05070A] rounded-sm border border-[#B8860B]/30 shrink-0">
          <button
            id="chart-mode-birth"
            onClick={() => setChartMode('birth')}
            className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition cursor-pointer ${
              chartMode === 'birth'
                ? 'bg-[#B8860B] text-[#05070A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F3F4F6]'
            }`}
          >
            Ma Trận Ngày Sinh
          </button>
          <button
            id="chart-mode-name"
            onClick={() => setChartMode('name')}
            className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition cursor-pointer ${
              chartMode === 'name'
                ? 'bg-[#B8860B] text-[#05070A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F3F4F6]'
            }`}
          >
            Ma Trận Tên
          </button>
          <button
            id="chart-mode-combined"
            onClick={() => setChartMode('combined')}
            className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition cursor-pointer ${
              chartMode === 'combined'
                ? 'bg-[#B8860B] text-[#05070A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F3F4F6]'
            }`}
          >
            Tổng Hòa
          </button>
        </div>
      </div>

      {/* Real-time Name / Nickname Compensator Tool */}
      <div className="bg-[#0A0D14] rounded-sm p-5 border border-[#B8860B]/30 shadow-xl space-y-3 geometric-corners">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#B8860B]">
              <Wand2 className="w-4 h-4" />
              <span>Trình Giả Lập Danh Xưng / Biệt Danh Bù Khuyết Ma Trận</span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Ngày sinh của bạn đang khuyết số:{' '}
              {missingInBirth.length > 0 ? (
                missingInBirth.map((n) => (
                  <span key={n} className="inline-block px-1.5 py-0.2 mx-0.5 rounded-sm bg-[#05070A] border border-[#B8860B]/40 text-[#B8860B] font-serif font-bold text-[11px]">
                    Số {n} ({LETTER_BY_NUM[n]})
                  </span>
                ))
              ) : (
                <strong className="text-[#B8860B]">Đầy đủ 9 số!</strong>
              )}
              . Nhập thử tên thường gọi / tên tiếng Anh để xem sự lấp đầy trên Ma Trận Tổng Hòa:
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              id="nickname-simulator-input"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (chartMode === 'birth' && e.target.value.trim()) {
                  setChartMode('combined');
                }
              }}
              placeholder="Nhập biệt danh (VD: ALEX, MINH...)"
              className="px-3.5 py-2 rounded-sm bg-[#05070A] border border-[#B8860B]/40 focus:border-[#B8860B] text-xs text-[#F3F4F6] placeholder-[#94A3B8]/50 outline-none w-56"
            />
            {nickname && (
              <button
                type="button"
                onClick={() => setNickname('')}
                className="p-2 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-[#94A3B8] hover:text-[#F3F4F6] transition cursor-pointer"
                title="Xóa biệt danh thử nghiệm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid & Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual 3x3 Matrix Grid */}
        <div className="lg:col-span-6 bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl flex flex-col justify-between relative geometric-corners">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#B8860B]/20">
              <span className="text-[11px] font-medium text-[#B8860B] uppercase tracking-[0.2em] font-serif">
                {chartMode === 'birth'
                  ? 'Ma Trận Ngày Sinh (Birth Chart)'
                  : chartMode === 'name'
                  ? 'Ma Trận Tên (Name Chart)'
                  : `Ma Trận Tổng Hòa${nickname ? ` (+ ${nickname.toUpperCase()})` : ''}`}
              </span>
              <span className="text-[11px] text-[#94A3B8]">Nhấn vào ô để giải mã</span>
            </div>

            <div className="space-y-3">
              {gridRows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-3 gap-3">
                  {row.map((cell) => {
                    const count = activeCounts[cell.num] || 0;
                    const birthCount = profile.birthChartCounts[cell.num] || 0;
                    const isCompensated = chartMode !== 'birth' && birthCount === 0 && count > 0;
                    const isIsolated = currentDetection.isolated.includes(cell.num);
                    const isCellSelected = selectedCellNum === cell.num;

                    return (
                      <div
                        key={cell.num}
                        id={`matrix-cell-${cell.num}`}
                        onClick={() => setSelectedCellNum(cell.num)}
                        className={`h-24 sm:h-28 rounded-sm p-3 border flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
                          isCellSelected
                            ? 'bg-[#05070A] border-[#B8860B] ring-1 ring-[#B8860B]/60 shadow-lg shadow-[#B8860B]/15'
                            : count > 0
                            ? 'bg-[#05070A] border-[#B8860B]/50 hover:border-[#B8860B]'
                            : 'bg-[#05070A]/50 border-[#B8860B]/15 text-[#94A3B8]/40 hover:border-[#B8860B]/40'
                        }`}
                      >
                        {/* Cell Number & Count Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs uppercase tracking-wider font-medium ${count > 0 ? 'text-[#F3F4F6]' : 'text-[#94A3B8]/40'}`}>
                            Số {cell.num}
                          </span>
                          {isCompensated ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-[#B8860B] text-[#05070A] font-serif">
                              Bù +{count}
                            </span>
                          ) : count > 0 ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 font-serif">
                              x{count}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#94A3B8]/40">Trống</span>
                          )}
                        </div>

                        {/* Cell Value Repetition Visual */}
                        <div className="text-center truncate">
                          {count > 0 ? (
                            <span className="text-xl sm:text-2xl font-bold text-[#B8860B] font-serif tracking-[0.15em]">
                              {Array(Math.min(count, 5)).fill(cell.num).join('')}
                              {count > 5 ? '+' : ''}
                            </span>
                          ) : (
                            <span className="text-xl font-thin text-[#94A3B8]/20">-</span>
                          )}
                        </div>

                        {/* Subtitle / Isolated Warning */}
                        <div className="text-[10px] text-[#94A3B8] truncate flex items-center justify-between uppercase tracking-wider">
                          <span>{cell.plane}</span>
                          {isIsolated && (
                            <span className="text-[#D4AF37] font-bold" title="Số ốc đảo cô lập (cần kết nối)">
                              Ốc đảo
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selected Cell Frequency Interpretation Box */}
            <div className="mt-4 p-4 rounded-sm bg-[#05070A] border border-[#B8860B]/35 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#B8860B] uppercase flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  {cellMeta.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#B8860B]/15 text-[#F3F4F6] border border-[#B8860B]/30 font-serif">
                  Xuất hiện: {selectedCellCount} lần
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {cellInterpretation}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#B8860B]/20 text-[11px] uppercase tracking-wider text-[#94A3B8] flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 border border-[#B8860B] rotate-45 bg-[#B8860B]" /> Ô có số: Năng lượng sở hữu
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 border border-[#B8860B]/30 rotate-45" /> Ô trống: Bài học cần bù đắp
            </span>
          </div>
        </div>

        {/* Arrows Analysis (Mũi tên có & Mũi tên trống - Dynamic per mode) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Arrows (Strengths) */}
          <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl relative geometric-corners">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#B8860B]/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
                <h3 className="text-xs font-normal uppercase tracking-[0.2em] text-[#F3F4F6] font-serif">
                  Mũi Tên Cá Tính Sở Hữu ({currentDetection.active.length})
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8860B]">
                {chartMode === 'birth' ? 'Theo Ngày Sinh' : chartMode === 'name' ? 'Theo Họ Tên' : 'Sau Khi Bù Khuyết'}
              </span>
            </div>

            {currentDetection.active.length > 0 ? (
              <div className="space-y-2.5">
                {currentDetection.active.map((arr) => {
                  const isNewlyUnlocked = chartMode !== 'birth' && !birthActiveCodes.has(arr.code);
                  return (
                    <div
                      key={arr.code}
                      onClick={() => setSelectedArrow(arr)}
                      className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 hover:border-[#B8860B]/60 cursor-pointer transition flex items-start justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#B8860B] font-serif uppercase tracking-wider">
                            [{arr.code}] {arr.name}
                          </span>
                          {isNewlyUnlocked ? (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#B8860B] text-[#05070A] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Mới kích hoạt nhờ Tên
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30">
                              Thế mạnh
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed line-clamp-2">
                          {arr.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#B8860B] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/20">
                Chưa có mũi tên 3 số liền mạch hoàn chỉnh ở chế độ này. Hãy chuyển sang tab <strong>Tổng Hòa</strong> để xem sự bù đắp từ Họ Tên!
              </p>
            )}
          </div>

          {/* Empty Arrows (Lessons) */}
          <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl relative geometric-corners">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#B8860B]/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
                <h3 className="text-xs font-normal uppercase tracking-[0.2em] text-[#F3F4F6] font-serif">
                  Mũi Tên Trống Cần Rèn Luyện ({currentDetection.empty.length})
                </h3>
              </div>
              {chartMode === 'combined' && profile.emptyArrows.length > currentDetection.empty.length && (
                <span className="text-[10px] text-[#B8860B] font-serif">
                  Đã hóa giải {profile.emptyArrows.length - currentDetection.empty.length} mũi tên trống!
                </span>
              )}
            </div>

            {currentDetection.empty.length > 0 ? (
              <div className="space-y-2.5">
                {currentDetection.empty.map((arr) => (
                  <div
                    key={arr.code}
                    onClick={() => setSelectedArrow(arr)}
                    className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/20 hover:border-[#B8860B]/60 cursor-pointer transition flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D4AF37] font-serif uppercase tracking-wider">
                          [{arr.code}] {arr.name}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#B8860B]/10 text-[#D4AF37] border border-[#B8860B]/30">
                          Bài học
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed line-clamp-2">
                        {arr.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8860B] shrink-0" />
                <span>Ma trận không còn mũi tên trống nào bị khuyết cả 3 số. Biểu đồ đạt độ cân bằng hình học lý tưởng!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Arrow Details Modal */}
      {selectedArrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A0D14] border border-[#B8860B]/40 rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 geometric-corners">
            <div className="flex items-center justify-between pb-3 border-b border-[#B8860B]/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
                <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
                  [{selectedArrow.code}] {selectedArrow.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArrow(null)}
                className="text-[#94A3B8] hover:text-[#F3F4F6] text-xs px-2.5 py-1 rounded-sm bg-[#05070A] border border-[#B8860B]/20 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#F3F4F6]">
              <div>
                <h4 className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-widest mb-1.5">
                  Luận giải chi tiết:
                </h4>
                <p className="bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/20 leading-relaxed text-xs text-[#94A3B8]">
                  {selectedArrow.description}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-medium text-[#B8860B] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Lời khuyên phát triển & hóa giải:
                </h4>
                <p className="bg-[#B8860B]/10 p-3.5 rounded-sm border border-[#B8860B]/30 text-[#F3F4F6] text-xs leading-relaxed">
                  {selectedArrow.advice}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedArrow(null)}
                className="px-5 py-2 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] text-xs font-serif font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
