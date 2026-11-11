import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Heart,
  UserCheck,
  Award,
  Sun,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  Zap,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';
import { LIFE_PATH_MEANINGS } from '../data/numerologyMeanings';
import { LETTER_VALUES, isVowel } from '../utils/numerologyCalculator';

interface OverviewCardProps {
  profile: NumerologyProfile;
  onOpenAIDeepReading: () => void;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ profile, onOpenAIDeepReading }) => {
  const [showFormula, setShowFormula] = useState(false);
  const [selectedCoreId, setSelectedCoreId] = useState<string>('life-path');

  const lifePathKey = profile.lifePath === 10 ? 10 : profile.lifePath;
  const lpMeaning = LIFE_PATH_MEANINGS[lifePathKey] || LIFE_PATH_MEANINGS[1];
  const destinyMeaning = LIFE_PATH_MEANINGS[profile.destiny] || LIFE_PATH_MEANINGS[1];
  const soulMeaning = LIFE_PATH_MEANINGS[profile.soulUrge] || LIFE_PATH_MEANINGS[1];
  const personalityMeaning = LIFE_PATH_MEANINGS[profile.personality] || LIFE_PATH_MEANINGS[1];

  const coreCards = [
    {
      id: 'life-path',
      title: 'Số Chủ Đạo (Đường Đời)',
      sub: 'Life Path Number',
      value: profile.lifePath === 11 ? '11/2' : profile.lifePath === 22 ? '22/4' : profile.lifePath === 33 ? '33/6' : profile.lifePathDisplay,
      isMaster: profile.lifePath === 11 || profile.lifePath === 22 || profile.lifePath === 33,
      color: 'text-[#B8860B]',
      icon: Compass,
      tag: 'Bản chất cốt lõi',
      summary: lpMeaning?.summary || 'Con số chỉ đường dẫn lối cho toàn bộ hành trình kiếp sống của bạn.',
      detailTitle: `Luận giải Số Chủ Đạo ${profile.lifePath === 11 ? '11/2 (Master)' : profile.lifePathDisplay} — ${lpMeaning?.name}`,
      detailText: `${lpMeaning?.summary} Trọng trách lớn nhất của bạn là: ${lpMeaning?.lifeMission}`,
      formulaNote: `Tổng các chữ số ngày sinh Dương lịch (${profile.birthDate}) rút gọn theo chuẩn Pythagoras.`,
    },
    {
      id: 'destiny',
      title: 'Số Sứ Mệnh (Vận Mệnh)',
      sub: 'Destiny / Expression',
      value: String(profile.destiny),
      color: 'text-[#D4AF37]',
      icon: Award,
      tag: 'Mục tiêu & Năng lực',
      summary: 'Khả năng tiềm ẩn vượt trội và đích đến bạn sinh ra để hoàn thành.',
      detailTitle: `Luận giải Số Sứ Mệnh ${profile.destiny} — ${destinyMeaning?.archetype}`,
      detailText: `Trong công việc và xã hội, bạn mang năng lượng của ${destinyMeaning?.name.toLowerCase()}. ${destinyMeaning?.summary} Các lĩnh vực giúp bạn tỏa sáng nhất: ${destinyMeaning?.idealCareers.slice(0, 4).join(', ')}.`,
      formulaNote: `Tổng toàn bộ chữ cái (Nguyên âm + Phụ âm) trong họ tên khai sinh "${profile.fullName}".`,
    },
    {
      id: 'soul-urge',
      title: 'Số Linh Hồn (Khao Khát)',
      sub: 'Soul Urge / Heart',
      value: String(profile.soulUrge),
      color: 'text-[#F3F4F6]',
      icon: Heart,
      tag: 'Khát vọng nội tâm',
      summary: 'Tiếng nói sâu kín từ trái tim, điều mang lại hạnh phúc đích thực cho bạn.',
      detailTitle: `Luận giải Số Linh Hồn ${profile.soulUrge} — Khát vọng sâu thẳm`,
      detailText: `Ẩn sâu bên trong vẻ ngoài, linh hồn bạn khao khát tần số của số ${profile.soulUrge} (${soulMeaning?.keyword}). Bạn chỉ thực sự viên mãn khi đời sống tinh thần được nuôi dưỡng bằng: ${soulMeaning?.lifeMission}`,
      formulaNote: `Tổng giá trị các Nguyên Âm (A, E, I, O, U, Y) trong họ tên khai sinh của bạn.`,
    },
    {
      id: 'personality',
      title: 'Số Nhân Cách',
      sub: 'Personality Number',
      value: String(profile.personality),
      color: 'text-[#B8860B]',
      icon: UserCheck,
      tag: 'Hình ảnh đối ngoại',
      summary: 'Ấn tượng đầu tiên và cách mọi người xung quanh nhìn nhận về bạn.',
      detailTitle: `Luận giải Số Nhân Cách ${profile.personality} — Ấn tượng ban đầu`,
      detailText: `Khi mới tiếp xúc, mọi người cảm nhận bạn mang phong thái của ${personalityMeaning?.name} (${personalityMeaning?.keyword}). Điểm mạnh giao tiếp của bạn là: ${personalityMeaning?.strengths.slice(0, 2).join(', ')}.`,
      formulaNote: `Tổng giá trị các Phụ Âm trong họ tên khai sinh "${profile.fullName}".`,
    },
  ];

  const activeCoreCard = coreCards.find((c) => c.id === selectedCoreId) || coreCards[0];

  const secondaryNumbers = [
    { label: 'Số Thái Độ', value: profile.attitude, icon: Sun, desc: 'Cách bạn phản ứng với tình huống bất ngờ (Ngày + Tháng sinh)' },
    { label: 'Số Ngày Sinh', value: profile.birthdayNumber, icon: Sparkles, desc: 'Tài năng đặc biệt được vũ trụ trao tặng riêng' },
    { label: 'Số Trưởng Thành', value: profile.maturity, icon: Award, desc: 'Đỉnh cao viên mãn sau tuổi 35 (Chủ Đạo + Sứ Mệnh)' },
    { label: 'Số Cân Bằng', value: profile.balanceNumber, icon: Compass, desc: 'Chỗ dựa tinh thần khi gặp sóng gió (Chữ cái đầu mỗi từ)' },
  ];

  // Breakdown words & letters for transparent formula verification
  const wordsBreakdown = profile.normalizedName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const chars = word.split('').map((ch, idx) => {
        const val = LETTER_VALUES[ch] || 0;
        const vowel = isVowel(ch, idx, word);
        return { ch, val, vowel };
      });
      const wordSum = chars.reduce((acc, c) => acc + c.val, 0);
      const vowelSum = chars.filter((c) => c.vowel).reduce((acc, c) => acc + c.val, 0);
      const consSum = chars.filter((c) => !c.vowel).reduce((acc, c) => acc + c.val, 0);
      return { word, chars, wordSum, vowelSum, consSum };
    });

  const totalVowelsRaw = wordsBreakdown.reduce((acc, w) => acc + w.vowelSum, 0);
  const totalConsRaw = wordsBreakdown.reduce((acc, w) => acc + w.consSum, 0);
  const totalNameRaw = totalVowelsRaw + totalConsRaw;
  const dateDigits = `${profile.birthDay}${profile.birthMonth}${profile.birthYear}`.split('');
  const dateRawSum = dateDigits.reduce((acc, d) => acc + parseInt(d, 10), 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner: Geometric Sacred Balance Intro */}
      <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-6 sm:p-8 shadow-2xl relative overflow-hidden geometric-corners">
        {/* Sacred Circles Watermark */}
        <div className="absolute right-4 -top-8 w-64 h-64 border border-[#B8860B]/10 rounded-full pointer-events-none" />
        <div className="absolute right-12 top-0 w-48 h-48 border border-[#B8860B]/10 rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8860B] font-medium font-serif">
                Bản Đồ Tần Số Năng Lượng Pythagoras
              </span>
              <span className="text-xs text-[#94A3B8]">
                • Ngày sinh: {profile.birthDate}{profile.birthTime ? ` • Giờ sinh: ${profile.birthTime}` : ''}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-normal text-[#F3F4F6] font-serif uppercase tracking-[0.1em]">
              {profile.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Cộng hưởng với nguồn năng lượng của con số chủ đạo{' '}
              <strong className="text-[#B8860B] font-serif font-bold text-base">{profile.lifePathDisplay}</strong> —{' '}
              <span className="text-[#F3F4F6] font-medium">{lpMeaning?.name}</span> ({lpMeaning?.keyword}). Con số đại diện cho quy luật tiến hóa linh hồn và trọng trách thiêng liêng kiếp này.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {/* AI Master CTA Button in Gold */}
            <button
              id="open-ai-reading-btn"
              onClick={onOpenAIDeepReading}
              className="group px-6 py-3.5 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-serif font-bold uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#05070A]" />
              <span>Luận Giải AI Master Chuyên Sâu</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Formula Transparency Toggle Button */}
            <button
              id="toggle-formula-breakdown-btn"
              onClick={() => setShowFormula(!showFormula)}
              className="px-4 py-2 rounded-sm bg-[#05070A] hover:bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/40 text-[11px] font-serif uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showFormula ? 'Ẩn Bảng Giải Mã Công Thức' : 'Xem Bóc Tách Công Thức Tên & Ngày Sinh'}</span>
              {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Step-by-Step Pythagorean Formula Breakdown Drawer */}
      {showFormula && (
        <div className="bg-[#0A0D14] border border-[#B8860B]/40 rounded-sm p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn geometric-corners">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#B8860B]/20">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#B8860B]" />
              <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#F3F4F6]">
                Minh Bạch Toán Học: Bóc Tách Chữ Cái & Ngày Sinh Chuẩn Pythagoras
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#B8860B]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B8860B]/20 border border-[#B8860B] inline-block" />
                Nguyên âm (Linh hồn)
              </span>
              <span className="flex items-center gap-1.5 text-[#94A3B8]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#05070A] border border-[#94A3B8]/40 inline-block" />
                Phụ âm (Nhân cách)
              </span>
            </div>
          </div>

          {/* Letter-by-letter visual matrix */}
          <div className="flex flex-wrap gap-4">
            {wordsBreakdown.map((w, wIdx) => (
              <div
                key={wIdx}
                className="bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/25 space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] border-b border-[#B8860B]/15 pb-1.5">
                  <span className="font-serif font-bold text-[#F3F4F6] tracking-wider">{w.word}</span>
                  <span className="text-[#94A3B8] ml-3">Tổng từ: <strong className="text-[#B8860B]">{w.wordSum}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  {w.chars.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className={`w-9 py-1.5 rounded-sm border text-center flex flex-col items-center ${
                        c.vowel
                          ? 'bg-[#B8860B]/15 border-[#B8860B] text-[#B8860B]'
                          : 'bg-[#0A0D14] border-[#94A3B8]/30 text-[#F3F4F6]'
                      }`}
                      title={c.vowel ? `Nguyên âm ${c.ch} = ${c.val}` : `Phụ âm ${c.ch} = ${c.val}`}
                    >
                      <span className="text-xs font-serif font-bold">{c.ch}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4 Formula Equations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-sm bg-[#05070A] border border-[#B8860B]/20 text-xs space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#B8860B] font-serif font-bold">
                1. Công Thức Số Chủ Đạo
              </div>
              <div className="text-[#94A3B8]">
                {dateDigits.join(' + ')} = <strong className="text-[#F3F4F6]">{dateRawSum}</strong> ➔{' '}
                <strong className="text-[#B8860B] font-serif">{profile.lifePathDisplay}</strong>
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#05070A] border border-[#B8860B]/20 text-xs space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-serif font-bold">
                2. Công Thức Số Sứ Mệnh
              </div>
              <div className="text-[#94A3B8]">
                Tổng chữ cái = <strong className="text-[#F3F4F6]">{totalNameRaw}</strong> ➔{' '}
                <strong className="text-[#D4AF37] font-serif">Số {profile.destiny}</strong>
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#05070A] border border-[#B8860B]/20 text-xs space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#B8860B] font-serif font-bold">
                3. Công Thức Số Linh Hồn
              </div>
              <div className="text-[#94A3B8]">
                Tổng nguyên âm = <strong className="text-[#F3F4F6]">{totalVowelsRaw}</strong> ➔{' '}
                <strong className="text-[#B8860B] font-serif">Số {profile.soulUrge}</strong>
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#05070A] border border-[#B8860B]/20 text-xs space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-serif font-bold">
                4. Công Thức Số Nhân Cách
              </div>
              <div className="text-[#94A3B8]">
                Tổng phụ âm = <strong className="text-[#F3F4F6]">{totalConsRaw}</strong> ➔{' '}
                <strong className="text-[#D4AF37] font-serif">Số {profile.personality}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Core Pillars of Geometric Matrix (Clickable for Deep Synthesis) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {coreCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedCoreId === card.id;
          return (
            <div
              key={card.id}
              id={`card-${card.id}`}
              onClick={() => setSelectedCoreId(card.id)}
              className={`bg-[#0A0D14] rounded-sm p-6 border shadow-xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between group geometric-corners cursor-pointer ${
                isSelected
                  ? 'border-[#B8860B] ring-1 ring-[#B8860B]/40 shadow-[#B8860B]/10'
                  : 'border-[#B8860B]/30 hover:border-[#B8860B]/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-3">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B]">
                    {card.tag}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-[#B8860B]/30 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#B8860B]" />
                  </div>
                </div>

                <div className="my-5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-normal text-[#F3F4F6] uppercase tracking-wider font-serif">
                      {card.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-0.5">{card.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-3xl sm:text-4xl font-bold ${card.color} font-serif leading-none tracking-tight`}>
                      {card.value}
                    </div>
                    {(card as any).isMaster && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 uppercase tracking-widest font-serif">
                        Master
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {card.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#B8860B]/20 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#94A3B8]">
                <span>{isSelected ? 'Đang chọn xem' : 'Nhấn xem chi tiết'}</span>
                <span className="text-[#B8860B] font-medium flex items-center gap-1">
                  Luận giải <ChevronRight className="w-3 h-3 text-[#B8860B]" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Core Pillar Deep Explanation Strip */}
      <div className="bg-[#0A0D14] rounded-sm p-5 border border-[#B8860B]/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 geometric-corners">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#B8860B]">
            <Info className="w-4 h-4 shrink-0" />
            <span>{activeCoreCard.detailTitle}</span>
          </div>
          <p className="text-xs text-[#F3F4F6]/90 leading-relaxed">
            {activeCoreCard.detailText}
          </p>
          <p className="text-[11px] text-[#94A3B8] italic">
            • Cơ sở tính toán: {activeCoreCard.formulaNote}
          </p>
        </div>
      </div>

      {/* Secondary Indicators & Karmic Lesson & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Secondary Numbers Strip */}
        <div className="lg:col-span-8 bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 relative geometric-corners">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#B8860B]/20">
            <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
            <h3 className="text-xs font-normal uppercase tracking-[0.2em] text-[#F3F4F6] font-serif">
              Các Chỉ Số Phụ Trợ Trong Ma Trận Năng Lượng
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {secondaryNumbers.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#05070A] p-4 rounded-sm border border-[#B8860B]/20 hover:border-[#B8860B]/40 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-medium">{sec.label}</span>
                    <Icon className="w-3.5 h-3.5 text-[#B8860B]" />
                  </div>
                  <div className="text-3xl font-bold text-[#B8860B] font-serif my-2">
                    {sec.value}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">{sec.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Core Strengths & Challenges summary */}
          <div className="mt-5 pt-4 border-t border-[#B8860B]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/20">
              <h4 className="text-xs uppercase tracking-wider text-[#B8860B] font-serif font-bold mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Điểm mạnh nổi bật:
              </h4>
              <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                {lpMeaning?.strengths.slice(0, 3).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#05070A] p-3.5 rounded-sm border border-[#B8860B]/20">
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-serif font-bold mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Thử thách & Điểm mù:
              </h4>
              <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                {lpMeaning?.weaknesses.slice(0, 3).map((ch, i) => (
                  <li key={i}>{ch}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Karmic Debt & Passions - Geometric Box with Gold Accent */}
        <div className="lg:col-span-4 bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/30 flex flex-col justify-between relative geometric-corners">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#B8860B]/20">
              <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
              <h3 className="text-xs font-normal uppercase tracking-[0.2em] text-[#F3F4F6] font-serif">
                Bài Học Nghiệp & Linh Hồn
              </h3>
            </div>

            {/* Karmic Debts */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium">Nợ nghiệp (Karmic Debt):</div>
              {profile.karmicDebts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.karmicDebts.map((kd, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-sm text-xs font-serif font-bold bg-[#05070A] text-[#B8860B] border border-[#B8860B]/40"
                    >
                      {kd}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 bg-[#05070A] p-2.5 rounded-sm border border-[#B8860B]/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                  Không có con số nợ nghiệp lớn trong lá số. Phước đức dồi dào!
                </p>
              )}
            </div>

            {/* Karmic Lessons (Missing numbers) */}
            <div className="mt-5 space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium">
                Số còn thiếu trong tên (Bài học rèn luyện):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.karmicLessons.length > 0 ? (
                  profile.karmicLessons.map((num) => (
                    <span
                      key={num}
                      className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-serif font-bold bg-[#05070A] text-[#B8860B] border border-[#B8860B]/30"
                      title={`Bài học rèn luyện phẩm chất số ${num}`}
                    >
                      {num}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#B8860B]">Đầy đủ 9 con số phẩm chất trong tên!</span>
                )}
              </div>
            </div>
          </div>

          {/* Solid Gold Highlight Advice Block */}
          <div className="mt-5 p-3.5 bg-[#B8860B] text-[#05070A] rounded-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold font-serif">
              Lời Khuyên Khai Sáng:
            </div>
            <p className="text-xs font-medium mt-1 leading-snug">
              {lpMeaning?.lifeMission || 'Hãy giữ tâm thế vững vàng và tin tưởng vào tiếng nói nội tâm của bạn.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
