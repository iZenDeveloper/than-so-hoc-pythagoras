import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Award,
  AlertCircle,
  Calendar,
  Clock,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { NumerologyProfile, PinnacleItem } from '../types/numerology';

interface PyramidOfLifeProps {
  profile: NumerologyProfile;
}

export const PyramidOfLife: React.FC<PyramidOfLifeProps> = ({ profile }) => {
  const currentAge = new Date().getFullYear() - profile.birthYear;
  const [selectedPeak, setSelectedPeak] = useState<PinnacleItem>(profile.pinnacles[0]);

  // Determine current active peak
  const getActivePeakIndex = () => {
    const p = profile.pinnacles;
    if (currentAge < p[0].age) return 0;
    if (currentAge <= p[1].age) return 1;
    if (currentAge <= p[2].age) return 2;
    return 3;
  };
  const activeIdx = getActivePeakIndex();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Kim Tự Tháp 4 Đỉnh Cao & Thử Thách Hình Học
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            Quy luật chu kỳ 27 năm tiến hóa linh hồn chia làm 4 đỉnh cao (mỗi đỉnh 9 năm) và các bài học thử thách.
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm bg-[#B8860B]/15 text-[#B8860B] font-bold border border-[#B8860B]/40 font-serif">
          Tuổi hiện tại: {currentAge} tuổi
        </span>
      </div>

      {/* SVG Interactive Pyramid Visualization */}
      <div className="bg-[#0A0D14] rounded-sm p-6 sm:p-8 border border-[#B8860B]/30 shadow-2xl relative overflow-hidden geometric-corners">
        <div className="max-w-3xl mx-auto py-4">
          <svg viewBox="0 0 700 380" className="w-full h-auto drop-shadow-md">
            {/* Pyramid Construction Lines */}
            <defs>
              <linearGradient id="pyramidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B8860B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Baseline connect nodes */}
            <line x1="150" y1="320" x2="350" y2="320" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
            <line x1="350" y1="320" x2="550" y2="320" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

            {/* Peak 1 & Peak 2 level: P1(x=250, y=210), P2(x=450, y=210) */}
            <line x1="150" y1="320" x2="250" y2="210" stroke="#B8860B" strokeWidth="2" />
            <line x1="350" y1="320" x2="250" y2="210" stroke="#B8860B" strokeWidth="2" />
            <line x1="350" y1="320" x2="450" y2="210" stroke="#B8860B" strokeWidth="2" />
            <line x1="550" y1="320" x2="450" y2="210" stroke="#B8860B" strokeWidth="2" />

            {/* Peak 3 level: P3(x=350, y=110) */}
            <line x1="250" y1="210" x2="350" y2="110" stroke="#B8860B" strokeWidth="2" />
            <line x1="450" y1="210" x2="350" y2="110" stroke="#B8860B" strokeWidth="2" />

            {/* Peak 4 level: P4(x=350, y=30) */}
            <line x1="150" y1="320" x2="350" y2="30" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <line x1="550" y1="320" x2="350" y2="30" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

            {/* Bottom Node Circles */}
            {/* Node A (Month) */}
            <g transform="translate(150, 320)">
              <circle r="22" fill="#05070A" stroke="#B8860B" strokeWidth="1.5" opacity="0.8" />
              <text textAnchor="middle" dy="4" fill="#F3F4F6" fontSize="11" fontFamily="Cinzel" fontWeight="bold">
                T.{profile.birthMonth}
              </text>
              <text textAnchor="middle" dy="36" fill="#94A3B8" fontSize="10" letterSpacing="0.1em">
                Tháng
              </text>
            </g>

            {/* Node B (Day) */}
            <g transform="translate(350, 320)">
              <circle r="22" fill="#05070A" stroke="#B8860B" strokeWidth="1.5" opacity="0.8" />
              <text textAnchor="middle" dy="4" fill="#F3F4F6" fontSize="11" fontFamily="Cinzel" fontWeight="bold">
                N.{profile.birthDay}
              </text>
              <text textAnchor="middle" dy="36" fill="#94A3B8" fontSize="10" letterSpacing="0.1em">
                Ngày
              </text>
            </g>

            {/* Node C (Year) */}
            <g transform="translate(550, 320)">
              <circle r="22" fill="#05070A" stroke="#B8860B" strokeWidth="1.5" opacity="0.8" />
              <text textAnchor="middle" dy="4" fill="#F3F4F6" fontSize="11" fontFamily="Cinzel" fontWeight="bold">
                {profile.birthYear}
              </text>
              <text textAnchor="middle" dy="36" fill="#94A3B8" fontSize="10" letterSpacing="0.1em">
                Năm
              </text>
            </g>

            {/* Peak 1 Node */}
            <g
              transform="translate(250, 210)"
              className="cursor-pointer"
              onClick={() => setSelectedPeak(profile.pinnacles[0])}
            >
              <circle
                r="26"
                fill={selectedPeak.peakNumber === 1 ? '#B8860B' : '#05070A'}
                stroke="#B8860B"
                strokeWidth={activeIdx === 0 ? '3' : '1.5'}
              />
              <text textAnchor="middle" dy="5" fill={selectedPeak.peakNumber === 1 ? '#05070A' : '#B8860B'} fontSize="15" fontFamily="Cinzel" fontWeight="bold">
                {profile.pinnacles[0].value}
              </text>
              <text textAnchor="middle" dy="-32" fill="#F3F4F6" fontSize="10" fontFamily="Cinzel" fontWeight="bold">
                Đỉnh 1 ({profile.pinnacles[0].age}t)
              </text>
            </g>

            {/* Peak 2 Node */}
            <g
              transform="translate(450, 210)"
              className="cursor-pointer"
              onClick={() => setSelectedPeak(profile.pinnacles[1])}
            >
              <circle
                r="26"
                fill={selectedPeak.peakNumber === 2 ? '#B8860B' : '#05070A'}
                stroke="#B8860B"
                strokeWidth={activeIdx === 1 ? '3' : '1.5'}
              />
              <text textAnchor="middle" dy="5" fill={selectedPeak.peakNumber === 2 ? '#05070A' : '#B8860B'} fontSize="15" fontFamily="Cinzel" fontWeight="bold">
                {profile.pinnacles[1].value}
              </text>
              <text textAnchor="middle" dy="-32" fill="#F3F4F6" fontSize="10" fontFamily="Cinzel" fontWeight="bold">
                Đỉnh 2 ({profile.pinnacles[1].age}t)
              </text>
            </g>

            {/* Peak 3 Node */}
            <g
              transform="translate(350, 110)"
              className="cursor-pointer"
              onClick={() => setSelectedPeak(profile.pinnacles[2])}
            >
              <circle
                r="28"
                fill={selectedPeak.peakNumber === 3 ? '#B8860B' : '#05070A'}
                stroke="#B8860B"
                strokeWidth={activeIdx === 2 ? '3' : '1.5'}
              />
              <text textAnchor="middle" dy="5" fill={selectedPeak.peakNumber === 3 ? '#05070A' : '#B8860B'} fontSize="16" fontFamily="Cinzel" fontWeight="bold">
                {profile.pinnacles[2].value}
              </text>
              <text textAnchor="middle" dy="-34" fill="#F3F4F6" fontSize="10" fontFamily="Cinzel" fontWeight="bold">
                Đỉnh 3 ({profile.pinnacles[2].age}t)
              </text>
            </g>

            {/* Peak 4 Node */}
            <g
              transform="translate(350, 30)"
              className="cursor-pointer"
              onClick={() => setSelectedPeak(profile.pinnacles[3])}
            >
              <circle
                r="26"
                fill={selectedPeak.peakNumber === 4 ? '#B8860B' : '#05070A'}
                stroke="#B8860B"
                strokeWidth={activeIdx === 3 ? '3' : '1.5'}
              />
              <text textAnchor="middle" dy="5" fill={selectedPeak.peakNumber === 4 ? '#05070A' : '#B8860B'} fontSize="15" fontFamily="Cinzel" fontWeight="bold">
                {profile.pinnacles[3].value}
              </text>
              <text textAnchor="middle" dy="-32" fill="#F3F4F6" fontSize="10" fontFamily="Cinzel" fontWeight="bold">
                Đỉnh 4 ({profile.pinnacles[3].age}t)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* 4 Peaks Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.pinnacles.map((p, idx) => {
          const isCurrent = idx === activeIdx;
          const isSelected = selectedPeak.peakNumber === p.peakNumber;

          return (
            <div
              key={p.peakNumber}
              id={`peak-card-${p.peakNumber}`}
              onClick={() => setSelectedPeak(p)}
              className={`p-5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between geometric-corners ${
                isSelected
                  ? 'bg-[#0A0D14] border-[#B8860B] shadow-xl shadow-[#B8860B]/10'
                  : 'bg-[#0A0D14]/60 border-[#B8860B]/20 hover:border-[#B8860B]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B]">
                    Đỉnh Cao {p.peakNumber}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold bg-[#B8860B] text-[#05070A]">
                      Hiện tại
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Mốc thời gian:</div>
                    <div className="text-xs font-serif font-bold text-[#F3F4F6] mt-0.5">
                      {p.age} tuổi (Năm {p.calendarYear})
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#B8860B] font-serif">
                    {p.value}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#B8860B]/20 text-[11px]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Thách thức:</span>
                    <span className="text-[#D4AF37] font-serif font-bold">Số {p.challengeValue}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Peak Deep Interpretation Box */}
      <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 shadow-xl space-y-4 geometric-corners">
        <div className="flex items-center justify-between pb-3 border-b border-[#B8860B]/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
              Chi Tiết Đỉnh Cao {selectedPeak.peakNumber}: Năng Lượng Số {selectedPeak.value} (Mốc {selectedPeak.age} Tuổi)
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8]">Năm: {selectedPeak.calendarYear}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#05070A] p-4 rounded-sm border border-[#B8860B]/20 space-y-2">
            <h4 className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider font-serif flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Cơ hội & Xu hướng đỉnh cao:
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {selectedPeak.meaning}
            </p>
          </div>

          <div className="bg-[#05070A] p-4 rounded-sm border border-[#B8860B]/20 space-y-2">
            <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-serif flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Thách thức cần hóa giải (Số {selectedPeak.challengeValue}):
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {selectedPeak.challengeMeaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
