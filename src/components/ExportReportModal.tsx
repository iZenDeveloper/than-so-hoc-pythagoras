import React from 'react';
import {
  Printer,
  X,
} from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';
import { LIFE_PATH_MEANINGS } from '../data/numerologyMeanings';
import { MarkdownView } from './MarkdownView';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: NumerologyProfile;
  deepReading?: string | null;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  deepReading,
}) => {
  if (!isOpen) return null;

  const lpKey = profile.lifePath === 10 ? 10 : profile.lifePath;
  const lp = LIFE_PATH_MEANINGS[lpKey] || LIFE_PATH_MEANINGS[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#0A0D14] text-[#F3F4F6] border border-[#B8860B]/40 rounded-sm max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 geometric-corners print:border-none print:shadow-none print:bg-white print:text-black print:my-0 print:p-6">
        {/* Modal Top Actions (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B8860B]/20 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-base sm:text-lg font-normal text-[#F3F4F6] uppercase tracking-wider font-serif">
              Báo Cáo Thần Số Học Pythagoras Toàn Diện
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-serif font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Báo Cáo / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-[#94A3B8] hover:text-[#F3F4F6] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 print:space-y-4">
          {/* Header Banner */}
          <div className="text-center pb-6 border-b border-[#B8860B]/30">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8860B] font-serif">
              PYTHAGOREAN NUMEROLOGY MASTER REPORT
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-serif mt-2 text-[#F3F4F6] print:text-black tracking-wider uppercase">
              HỒ SƠ GIẢI MÃ VẬN MỆNH & TIỀM NĂNG
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs text-[#94A3B8] mt-2 print:text-gray-600 flex-wrap">
              <span>Họ tên: <strong className="text-[#B8860B] font-serif print:text-black">{profile.fullName}</strong></span>
              <span>•</span>
              <span>Ngày sinh: <strong className="text-[#B8860B] font-serif print:text-black">{profile.birthDate}{profile.birthTime ? ` • Giờ sinh: ${profile.birthTime}` : ''}</strong></span>
              <span>•</span>
              <span>Năm xem: <strong className="text-[#F3F4F6] font-serif print:text-black">{profile.currentYear}</strong></span>
            </div>
          </div>

          {/* 4 Core Sacred Numbers Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-center geometric-corners print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-serif print:text-gray-600">Số Chủ Đạo</span>
              <div className="text-3xl font-bold text-[#B8860B] font-serif my-1 print:text-black">
                {profile.lifePath === 11 ? '11/2' : profile.lifePath === 22 ? '22/4' : profile.lifePath === 33 ? '33/6' : profile.lifePathDisplay}
              </div>
              {(profile.lifePath === 11 || profile.lifePath === 22 || profile.lifePath === 33) && (
                <span className="text-[10px] text-[#B8860B] font-serif font-bold uppercase tracking-wider">
                  Master
                </span>
              )}
              <span className="text-[10px] text-[#94A3B8] block">{lp.name}</span>
            </div>

            <div className="p-4 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-center geometric-corners print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-serif print:text-gray-600">Số Sứ Mệnh</span>
              <div className="text-3xl font-bold text-[#D4AF37] font-serif my-1 print:text-black">
                {profile.destiny}
              </div>
              <span className="text-[10px] text-[#94A3B8]">Vận Mệnh & Đích Đến</span>
            </div>

            <div className="p-4 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-center geometric-corners print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-serif print:text-gray-600">Số Linh Hồn</span>
              <div className="text-3xl font-bold text-[#B8860B] font-serif my-1 print:text-black">
                {profile.soulUrge}
              </div>
              <span className="text-[10px] text-[#94A3B8]">Khao Khát Sâu Kín</span>
            </div>

            <div className="p-4 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-center geometric-corners print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-serif print:text-gray-600">Số Nhân Cách</span>
              <div className="text-3xl font-bold text-[#D4AF37] font-serif my-1 print:text-black">
                {profile.personality}
              </div>
              <span className="text-[10px] text-[#94A3B8]">Ấn Tượng Đối Ngoại</span>
            </div>
          </div>

          {/* Core Profile Summary */}
          <div className="p-5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 space-y-2 geometric-corners print:bg-gray-50 print:border-gray-300">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8860B] font-serif print:text-black">
              1. Chân Dung Tính Cách & Sứ Mệnh Cuộc Đời
            </h3>
            <p className="text-xs text-[#94A3B8] print:text-gray-800 leading-relaxed">
              {lp.summary} {lp.lifeMission}
            </p>
          </div>

          {/* 3x3 Combined Matrix Summary */}
          <div className="p-5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 space-y-3 geometric-corners print:bg-gray-50 print:border-gray-300">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8860B] font-serif print:text-black">
              2. Ma Trận 3x3 Ngày Sinh & Họ Tên
            </h3>
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              {[
                [3, 6, 9],
                [2, 5, 8],
                [1, 4, 7],
              ].map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  {row.map((num) => {
                    const bCount = profile.birthChartCounts[num] || 0;
                    const cCount = profile.combinedChartCounts[num] || 0;
                    return (
                      <div
                        key={num}
                        className="p-2.5 rounded-sm bg-[#0A0D14] border border-[#B8860B]/20 text-center print:bg-white print:border-gray-300"
                      >
                        <div className="text-[10px] text-[#94A3B8] print:text-gray-600">Ô số {num}</div>
                        <div className="text-sm font-serif font-bold text-[#B8860B] print:text-black">
                          {bCount > 0 ? Array(bCount).fill(num).join('') : '-'}
                        </div>
                        <div className="text-[9px] text-[#94A3B8] print:text-gray-500">
                          Tổng hòa: x{cCount}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 4 Pinnacle Peaks Summary */}
          <div className="p-5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 space-y-3 geometric-corners print:bg-gray-50 print:border-gray-300">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8860B] font-serif print:text-black">
              3. Bốn Đỉnh Cao Kim Tự Tháp Cuộc Đời
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {profile.pinnacles.map((p) => (
                <div key={p.peakNumber} className="p-2.5 rounded-sm bg-[#0A0D14] border border-[#B8860B]/20 print:bg-white print:border-gray-200">
                  <div className="font-serif font-bold text-[#F3F4F6] print:text-black">Đỉnh {p.peakNumber}: Số {p.value}</div>
                  <div className="text-[#94A3B8] text-[11px]">Năm {p.calendarYear} ({p.age} tuổi)</div>
                  <div className="text-[#D4AF37] text-[10px] mt-1">Thách thức: {p.challengeValue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Year Guidance */}
          <div className="p-5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 space-y-2 geometric-corners print:bg-gray-50 print:border-gray-300">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8860B] font-serif print:text-black">
              4. Vận Trình Năm Cá Nhân ({profile.currentYear} - Năm Số {profile.personalYear})
            </h3>
            <p className="text-xs text-[#94A3B8] print:text-gray-800">
              Đây là thời điểm tập trung phát huy năng lượng chu kỳ, tận dụng tối đa cơ hội và giữ tâm thế vững vàng trước thử thách.
            </p>
          </div>

          {/* Deep AI Reading if generated */}
          {deepReading && (
            <div className="p-5 rounded-sm bg-[#05070A] border border-[#B8860B]/25 space-y-2 geometric-corners print:bg-gray-50 print:border-gray-300">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8860B] font-serif print:text-black">
                5. Bản Luận Giải Chuyên Sâu AI Master
              </h3>
              <div className="text-xs text-[#94A3B8] print:text-gray-800">
                <MarkdownView content={deepReading} />
              </div>
            </div>
          )}

          {/* Footer stamp */}
          <div className="text-center pt-4 border-t border-[#B8860B]/20 text-[11px] text-[#94A3B8] print:text-gray-400">
            Bản quyền báo cáo © {profile.currentYear} Thần Số Học Pythagoras Pro • Thiết kế Geometric Balance
          </div>
        </div>
      </div>
    </div>
  );
};
