import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  AlertTriangle,
  User,
  Bot,
  Loader2,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NumerologyProfile, CompatibilityReport } from '../types/numerology';
import { generateNumerologyProfile, calculateCompatibility } from '../utils/numerologyCalculator';
import { generateDeterministicCompatibility } from '../utils/fallbackNumerology';
import { MarkdownView } from './MarkdownView';

interface CompatibilityTabProps {
  currentProfile: NumerologyProfile | null;
  savedProfiles?: NumerologyProfile[];
}

export const CompatibilityTab: React.FC<CompatibilityTabProps> = ({
  currentProfile,
  savedProfiles = [],
}) => {
  // Person 1 State
  const [p1Name, setP1Name] = useState(currentProfile?.fullName || 'Nguyễn Văn An');
  const [p1Date, setP1Date] = useState(currentProfile?.birthDate || '1995-10-24');

  // Person 2 State
  const [p2Name, setP2Name] = useState('Trần Thị Mai Anh');
  const [p2Date, setP2Date] = useState('1998-05-18');
  const [relType, setRelType] = useState('Tình yêu & Hôn nhân');

  const [report, setReport] = useState<CompatibilityReport | null>(null);
  const [profileA, setProfileA] = useState<NumerologyProfile | null>(null);
  const [profileB, setProfileB] = useState<NumerologyProfile | null>(null);

  // AI Deep Compatibility Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync Person 1 whenever currentProfile changes
  useEffect(() => {
    if (currentProfile) {
      setP1Name(currentProfile.fullName);
      setP1Date(currentProfile.birthDate);
    }
  }, [currentProfile]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!p1Name.trim() || !p1Date || !p2Name.trim() || !p2Date) return;

    const prof1 = generateNumerologyProfile(p1Name.trim(), p1Date);
    const prof2 = generateNumerologyProfile(p2Name.trim(), p2Date);
    const res = calculateCompatibility(prof1, prof2);

    setProfileA(prof1);
    setProfileB(prof2);
    setReport(res);
    setAiAnalysis(null);

    if (res.overallScore >= 85) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleGetAiAnalysis = async () => {
    if (!profileA || !profileB) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/numerology/ai-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personA: profileA,
          personB: profileB,
          relationshipType: relType,
        }),
      });
      let analysisText = '';
      if (res.ok) {
        const data = await res.json();
        analysisText = data.analysis;
      }
      if (!analysisText) {
        analysisText = generateDeterministicCompatibility(profileA, profileB, relType);
      }
      setAiAnalysis(analysisText);
    } catch (err) {
      console.warn('Network issue fetching AI compatibility, using deterministic Pythagoras engine:', err);
      setAiAnalysis(generateDeterministicCompatibility(profileA, profileB, relType));
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Bói Tương Hợp Cặp Đôi & Đối Tác Hình Học
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            So sánh tần số rung động đối xứng giữa 2 người qua Số Chủ Đạo, Số Linh Hồn và Số Sứ Mệnh.
          </p>
        </div>
      </div>

      {/* Dual Profiles Input Form */}
      <form onSubmit={handleCalculate} className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl space-y-6 geometric-corners">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Person 1 Box */}
          <div className="bg-[#05070A] p-5 rounded-sm border border-[#B8860B]/25 space-y-4 geometric-corners">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20 gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-[#B8860B] uppercase tracking-[0.15em] font-serif flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Người Thứ Nhất (Bạn)
              </span>
              {savedProfiles.length > 0 && (
                <div className="flex items-center gap-1">
                  <History className="w-3 h-3 text-[#B8860B]" />
                  <select
                    aria-label="Chọn hồ sơ người thứ nhất"
                    value=""
                    onChange={(e) => {
                      const found = savedProfiles.find((p) => p.id === e.target.value);
                      if (found) {
                        setP1Name(found.fullName);
                        setP1Date(found.birthDate);
                      }
                    }}
                    className="bg-[#0A0D14] border border-[#B8860B]/30 text-[11px] text-[#94A3B8] px-2 py-0.5 rounded-sm outline-none cursor-pointer"
                  >
                    <option value="">Chọn từ hồ sơ đã lưu...</option>
                    {savedProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.birthDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1">Họ và tên:</label>
              <input
                type="text"
                required
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Ví dụ: NGUYỄN VĂN AN"
                className="w-full px-3 py-2 rounded-sm bg-[#0A0D14] border border-[#B8860B]/30 text-[#F3F4F6] text-xs sm:text-sm focus:border-[#B8860B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1">Ngày sinh:</label>
              <input
                type="date"
                required
                value={p1Date}
                onChange={(e) => setP1Date(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-[#0A0D14] border border-[#B8860B]/30 text-[#F3F4F6] text-xs sm:text-sm focus:border-[#B8860B] focus:outline-none"
              />
            </div>
          </div>

          {/* Person 2 Box */}
          <div className="bg-[#05070A] p-5 rounded-sm border border-[#B8860B]/25 space-y-4 geometric-corners">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20 gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-[#D4AF37] uppercase tracking-[0.15em] font-serif flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Người Thứ Hai (Đối Phương)
              </span>
              {savedProfiles.length > 0 && (
                <div className="flex items-center gap-1">
                  <History className="w-3 h-3 text-[#D4AF37]" />
                  <select
                    aria-label="Chọn hồ sơ người thứ hai"
                    value=""
                    onChange={(e) => {
                      const found = savedProfiles.find((p) => p.id === e.target.value);
                      if (found) {
                        setP2Name(found.fullName);
                        setP2Date(found.birthDate);
                      }
                    }}
                    className="bg-[#0A0D14] border border-[#B8860B]/30 text-[11px] text-[#94A3B8] px-2 py-0.5 rounded-sm outline-none cursor-pointer"
                  >
                    <option value="">Chọn từ hồ sơ đã lưu...</option>
                    {savedProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.birthDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1">Họ và tên:</label>
              <input
                type="text"
                required
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Ví dụ: TRẦN THỊ MAI ANH"
                className="w-full px-3 py-2 rounded-sm bg-[#0A0D14] border border-[#B8860B]/30 text-[#F3F4F6] text-xs sm:text-sm focus:border-[#B8860B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] mb-1">Ngày sinh:</label>
              <input
                type="date"
                required
                value={p2Date}
                onChange={(e) => setP2Date(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-[#0A0D14] border border-[#B8860B]/30 text-[#F3F4F6] text-xs sm:text-sm focus:border-[#B8860B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Relationship Type & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#94A3B8]">Mục đích:</span>
            <select
              value={relType}
              onChange={(e) => setRelType(e.target.value)}
              className="px-3 py-1.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-xs text-[#F3F4F6] focus:border-[#B8860B] focus:outline-none"
            >
              <option value="Tình yêu & Hôn nhân">Tình yêu & Hôn nhân</option>
              <option value="Hợp tác làm ăn / Kinh doanh">Hợp tác làm ăn / Kinh doanh</option>
              <option value="Tình bạn & Tri kỷ">Tình bạn & Tri kỷ</option>
            </select>
          </div>

          <button
            id="calculate-compatibility-btn"
            type="submit"
            className="px-6 py-2.5 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Phân Tích Tương Hợp</span>
          </button>
        </div>
      </form>

      {/* Compatibility Results Display */}
      {report && profileA && profileB && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Score Hero Card */}
          <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 geometric-corners">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 font-serif">
                  Kết Quả Hòa Hợp Tần Số
                </span>
                <span className="text-xs text-[#94A3B8]">{relType}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
                {profileA.fullName} & {profileB.fullName}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Đánh giá tổng quan: <strong className="text-[#B8860B] font-serif">{report.grade}</strong>
              </p>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm bg-[#05070A] border-2 border-[#B8860B] p-2 flex flex-col items-center justify-center geometric-corners">
                <span className="text-3xl sm:text-4xl font-bold text-[#B8860B] font-serif">
                  {report.overallScore}%
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#94A3B8]">Độ hòa hợp</span>
              </div>

              {/* AI Deep Analysis CTA */}
              <button
                id="get-ai-compatibility-btn"
                onClick={handleGetAiAnalysis}
                disabled={isAiLoading}
                className="px-4 py-3 rounded-sm bg-[#05070A] hover:bg-[#0A0D14] border border-[#B8860B]/40 text-xs font-serif font-bold uppercase tracking-wider text-[#B8860B] flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B8860B]" />
                    <span>Đang luận giải AI...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 text-[#B8860B]" />
                    <span>Luận Giải AI Chi Tiết</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Pillars of Compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/30 space-y-2 geometric-corners">
              <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B8860B] font-serif">1. Số Chủ Đạo ({profileA.lifePath} & {profileB.lifePath})</span>
                <span className="text-xs font-serif font-bold text-[#F3F4F6]">{report.lifePathMatch.score}%</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {report.lifePathMatch.description}
              </p>
            </div>

            <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/30 space-y-2 geometric-corners">
              <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] font-serif">2. Số Linh Hồn ({profileA.soulUrge} & {profileB.soulUrge})</span>
                <span className="text-xs font-serif font-bold text-[#F3F4F6]">{report.soulUrgeMatch.score}%</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {report.soulUrgeMatch.description}
              </p>
            </div>

            <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/30 space-y-2 geometric-corners">
              <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#F3F4F6] font-serif">3. Số Sứ Mệnh ({profileA.destiny} & {profileB.destiny})</span>
                <span className="text-xs font-serif font-bold text-[#F3F4F6]">{report.destinyMatch.score}%</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {report.destinyMatch.description}
              </p>
            </div>
          </div>

          {/* Strengths & Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-5 space-y-3 geometric-corners">
              <h4 className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                Điểm Mạnh & Bổ Trợ Cho Nhau:
              </h4>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 border border-[#B8860B] rotate-45 bg-[#B8860B] mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-5 space-y-3 geometric-corners">
              <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
                Cẩm Nang Giao Tiếp & Gắn Kết Bền Lâu:
              </h4>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {report.advice.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 border border-[#D4AF37] rotate-45 mt-1.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Compatibility Deep Reading Result Box */}
          {aiAnalysis && (
            <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/40 shadow-2xl space-y-4 geometric-corners">
              <div className="flex items-center gap-2 pb-3 border-b border-[#B8860B]/20">
                <Bot className="w-5 h-5 text-[#B8860B]" />
                <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
                  Luận Giải Tương Hợp Chi Tiết Từ AI Master Numerologist
                </h3>
              </div>
              <div className="text-xs leading-relaxed bg-[#05070A] p-5 rounded-sm border border-[#B8860B]/20 text-[#94A3B8]">
                <MarkdownView content={aiAnalysis} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
