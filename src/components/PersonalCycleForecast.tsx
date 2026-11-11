import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  Sun,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';
import { PERSONAL_YEAR_MEANINGS } from '../data/numerologyMeanings';
import { reduceNumber } from '../utils/numerologyCalculator';

interface PersonalCycleForecastProps {
  profile: NumerologyProfile;
}

export const PersonalCycleForecast: React.FC<PersonalCycleForecastProps> = ({ profile }) => {
  const currentCalendarYear = profile.currentYear;
  const [selectedYearOffset, setSelectedYearOffset] = useState<number>(0);

  const targetYear = currentCalendarYear + selectedYearOffset;
  const targetUnivYear = reduceNumber(targetYear, false);
  const targetPersonalYear = reduceNumber(profile.birthDay + profile.birthMonth + targetUnivYear, false);

  const yearData = PERSONAL_YEAR_MEANINGS[targetPersonalYear] || PERSONAL_YEAR_MEANINGS[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Dự Báo Vận Hạn: Năm - Tháng - Ngày Cá Nhân
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            Vận trình năng lượng biến đổi theo chu kỳ 9 năm đối xứng hình học (9-Year Epicycle).
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#05070A] rounded-sm border border-[#B8860B]/30">
          {[-1, 0, 1, 2].map((offset) => {
            const y = currentCalendarYear + offset;
            const isSelected = selectedYearOffset === offset;
            return (
              <button
                key={offset}
                id={`btn-year-${y}`}
                onClick={() => setSelectedYearOffset(offset)}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#B8860B] text-[#05070A] font-bold shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F3F4F6]'
                }`}
              >
                {y} {offset === 0 ? '(Hiện tại)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Real-time Energy Gauges (Year / Month / Day) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Personal Year */}
        <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/40 shadow-xl flex items-center justify-between geometric-corners">
          <div>
            <span className="text-[10px] text-[#B8860B] font-medium uppercase tracking-[0.2em] font-serif">
              Năm Cá Nhân ({targetYear})
            </span>
            <h3 className="text-xs font-serif font-bold text-[#F3F4F6] mt-1">{yearData.title}</h3>
            <p className="text-[10px] text-[#94A3B8] mt-1">Năng lượng 12 tháng</p>
          </div>
          <div className="text-4xl font-bold text-[#B8860B] font-serif ml-3 shrink-0">
            {targetPersonalYear}
          </div>
        </div>

        {/* Personal Month */}
        <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/30 shadow-xl flex items-center justify-between geometric-corners">
          <div>
            <span className="text-[10px] text-[#D4AF37] font-medium uppercase tracking-[0.2em] font-serif">
              Tháng Cá Nhân (T.{profile.personalMonth})
            </span>
            <h3 className="text-xs font-serif font-bold text-[#F3F4F6] mt-1">Tháng Số {profile.personalMonth}</h3>
            <p className="text-[10px] text-[#94A3B8] mt-1">Hành động trọng tâm</p>
          </div>
          <div className="text-4xl font-bold text-[#D4AF37] font-serif ml-3 shrink-0">
            {profile.personalMonth}
          </div>
        </div>

        {/* Personal Day */}
        <div className="bg-[#0A0D14] p-5 rounded-sm border border-[#B8860B]/30 shadow-xl flex items-center justify-between geometric-corners">
          <div>
            <span className="text-[10px] text-[#F3F4F6] font-medium uppercase tracking-[0.2em] font-serif">
              Ngày Cá Nhân (Hôm Nay)
            </span>
            <h3 className="text-xs font-serif font-bold text-[#F3F4F6] mt-1">Ngày Số {profile.personalDay}</h3>
            <p className="text-[10px] text-[#94A3B8] mt-1">Tần số hôm nay</p>
          </div>
          <div className="text-4xl font-bold text-[#F3F4F6] font-serif ml-3 shrink-0">
            {profile.personalDay}
          </div>
        </div>
      </div>

      {/* Deep Forecast for Selected Personal Year */}
      <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl space-y-6 geometric-corners">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-[#B8860B]/20">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
              Luận Giải Vận Trình Năm {targetYear} (Năm Số {targetPersonalYear})
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed bg-[#05070A] p-4 rounded-sm border border-[#B8860B]/20">
            {yearData.theme} {yearData.advice}
          </p>
        </div>

        {/* Do's & Don'ts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Things to DO */}
          <div className="bg-[#05070A] border border-[#B8860B]/30 rounded-sm p-5 space-y-3 geometric-corners">
            <h4 className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider font-serif flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
              Nên Làm (Khai Mở Năng Lượng & May Mắn):
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {yearData.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 border border-[#B8860B] rotate-45 bg-[#B8860B] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to DON'T */}
          <div className="bg-[#05070A] border border-[#B8860B]/20 rounded-sm p-5 space-y-3 geometric-corners">
            <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-serif flex items-center gap-2">
              <XCircle className="w-4 h-4 text-[#D4AF37]" />
              Tối Kỵ Tránh Làm (Hạn Chế Rủi Ro):
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {yearData.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 border border-[#D4AF37] rotate-45 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
