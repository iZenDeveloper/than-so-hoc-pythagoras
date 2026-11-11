import React from 'react';
import {
  Briefcase,
  Sparkles,
  Award,
  Compass,
  Flame,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Gem,
  Palette,
} from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';
import { LIFE_PATH_MEANINGS } from '../data/numerologyMeanings';

interface CareerTalentTabProps {
  profile: NumerologyProfile;
}

export const CareerTalentTab: React.FC<CareerTalentTabProps> = ({ profile }) => {
  const lpKey = profile.lifePath === 10 ? 10 : profile.lifePath;
  const lp = LIFE_PATH_MEANINGS[lpKey] || LIFE_PATH_MEANINGS[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Định Hướng Nghề Nghiệp & Khai Phóng Tài Năng
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            Môi trường công việc lý tưởng theo năng lượng Số Chủ Đạo ({profile.lifePathDisplay}) và Số Sứ Mệnh ({profile.destiny}).
          </p>
        </div>
      </div>

      {/* Hero Archetype Box */}
      <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-6 shadow-xl space-y-4 geometric-corners">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B] font-serif">
              Hình Mẫu Năng Lượng Sự Nghiệp
            </span>
            <h3 className="text-xl sm:text-2xl font-normal text-[#F3F4F6] font-serif uppercase tracking-wider mt-1">
              {lp.archetype} — {lp.name}
            </h3>
          </div>
          <div className="px-4 py-1.5 rounded-sm bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/30 text-xs font-serif font-bold uppercase tracking-wider shrink-0">
            Từ khóa: {lp.keyword}
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#05070A] p-4 rounded-sm border border-[#B8860B]/20">
          <strong className="text-[#B8860B] font-serif uppercase tracking-wider">Sứ mệnh kiếp sống:</strong> {lp.lifeMission}
        </p>
      </div>

      {/* Ideal Careers & Work Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Careers List */}
        <div className="lg:col-span-7 bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl space-y-4 geometric-corners">
          <div className="flex items-center gap-2 pb-3 border-b border-[#B8860B]/20">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
              Top Ngành Nghề & Vị Trí Thăng Hoa Nhất
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lp.idealCareers.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/20 hover:border-[#B8860B]/50 transition flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-sm bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/30 flex items-center justify-center font-serif font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-medium text-[#F3F4F6]">{c}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#94A3B8] flex items-center gap-1.5 border-t border-[#B8860B]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>
              Kết hợp số Sứ Mệnh <strong className="text-[#B8860B]">{profile.destiny}</strong>: Khả năng triển khai dự án có tính tầm nhìn và kỷ luật cao.
            </span>
          </div>
        </div>

        {/* Feng Shui, Colors & Lucky Gems */}
        <div className="lg:col-span-5 bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl space-y-4 geometric-corners">
          <div className="flex items-center gap-2 pb-3 border-b border-[#B8860B]/20">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
              Phong Thủy Năng Lượng & Màu Sắc
            </h3>
          </div>

          <div className="space-y-3">
            {/* Colors */}
            <div className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/20 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-serif uppercase tracking-wider text-[#B8860B]">
                <Palette className="w-3.5 h-3.5 text-[#B8860B]" /> Màu sắc thu hút tài lộc:
              </div>
              <div className="flex flex-wrap gap-2">
                {lp.luckyColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#0A0D14] text-[#F3F4F6] border border-[#B8860B]/30"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Gems */}
            <div className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/20 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-serif uppercase tracking-wider text-[#D4AF37]">
                <Gem className="w-3.5 h-3.5 text-[#D4AF37]" /> Đá quý & Tinh thể trợ mệnh:
              </div>
              <div className="flex flex-wrap gap-2">
                {lp.luckyGems.map((gem, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#0A0D14] text-[#D4AF37] border border-[#B8860B]/30"
                  >
                    {gem}
                  </span>
                ))}
              </div>
            </div>

            {/* Compatible numbers */}
            <div className="p-3.5 rounded-sm bg-[#05070A] border border-[#B8860B]/20 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-serif uppercase tracking-wider text-[#94A3B8]">
                <Compass className="w-3.5 h-3.5 text-[#B8860B]" /> Con số hòa hợp kinh doanh:
              </div>
              <div className="flex items-center gap-2">
                {lp.compatibleNumbers.map((num) => (
                  <span
                    key={num}
                    className="w-7 h-7 rounded-sm bg-[#0A0D14] text-[#B8860B] border border-[#B8860B]/40 flex items-center justify-center font-serif font-bold text-xs"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-5 space-y-3 geometric-corners">
          <h4 className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider font-serif flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
            Thế Mạnh Thiên Bẩm Trong Công Việc:
          </h4>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            {lp.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 border border-[#B8860B] rotate-45 bg-[#B8860B] mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0A0D14] border border-[#B8860B]/20 rounded-sm p-5 space-y-3 geometric-corners">
          <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-serif flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[#D4AF37]" />
            Điểm Mù Cần Chuyển Hóa:
          </h4>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            {lp.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 border border-[#D4AF37] rotate-45 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
