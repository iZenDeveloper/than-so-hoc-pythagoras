import React, { useState, useEffect } from 'react';
import { Calendar, User, Wand2, ArrowRight, ChevronUp, ChevronDown, Edit3, Clock } from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';

interface NumerologyFormProps {
  onSubmit: (name: string, birthDate: string, gender: 'male' | 'female' | 'other', birthTime?: string) => void;
  currentProfile: NumerologyProfile | null;
  defaultCollapsed?: boolean;
}

export const NumerologyForm: React.FC<NumerologyFormProps> = ({
  onSubmit,
  currentProfile,
  defaultCollapsed = false,
}) => {
  const [name, setName] = useState(currentProfile?.fullName || 'Nguyễn Khanh Hà Vy');
  const [birthDate, setBirthDate] = useState(currentProfile?.birthDate || '2013-02-21');
  const [birthTime, setBirthTime] = useState(currentProfile?.birthTime || '07:45');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentProfile?.gender || 'female');
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Sync form inputs whenever the selected profile changes from Saved Profiles or presets
  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.fullName);
      setBirthDate(currentProfile.birthDate);
      setBirthTime(currentProfile.birthTime || '');
      setGender(currentProfile.gender || 'female');
    }
  }, [currentProfile]);

  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const presets = [
    { name: 'Nguyễn Khanh Hà Vy', date: '2013-02-21', time: '07:45', gender: 'female' as const, label: 'Mẫu 1 (Số 11/2)' },
    { name: 'Nguyễn Văn An', date: '1995-10-24', time: '', gender: 'male' as const, label: 'Mẫu 2 (Số 22/4)' },
    { name: 'Trần Thị Mai Anh', date: '1998-05-18', time: '', gender: 'female' as const, label: 'Mẫu 3 (Số 11/2)' },
    { name: 'Lê Hoàng Long', date: '1990-08-08', time: '', gender: 'male' as const, label: 'Mẫu 4 (Số 8)' },
    { name: 'Phạm Minh Trí', date: '2001-03-15', time: '', gender: 'male' as const, label: 'Mẫu 5 (Số 3)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;
    onSubmit(name.trim(), birthDate, gender, birthTime.trim() || undefined);
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setName(preset.name);
    setBirthDate(preset.date);
    setBirthTime(preset.time || '');
    setGender(preset.gender);
    onSubmit(preset.name, preset.date, preset.gender, preset.time || undefined);
  };

  return (
    <div className="bg-[#0A0D14] border border-[#B8860B]/30 rounded-sm p-4 sm:p-6 shadow-2xl relative overflow-hidden geometric-corners transition-all">
      {/* Decorative subtle ambient sacred gold radial background */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45 shrink-0" />
              <h2 className="text-sm sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
                Tra Cứu Ma Trận Thần Số Học Pythagoras
              </h2>
            </div>
            {!isCollapsed && (
              <p className="text-xs text-[#94A3B8] mt-1 pl-5">
                Khám phá năng lượng con số qua biểu đồ hình học thiêng liêng của họ tên, ngày sinh và giờ sinh.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden px-2.5 py-1 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-[11px] text-[#B8860B] flex items-center gap-1 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Quick Sample Presets & Collapse Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
          {isCollapsed && currentProfile ? (
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <span>
                Đang xem: <strong className="text-[#F3F4F6] font-serif uppercase">{currentProfile.fullName}</strong> ({currentProfile.birthDate}{currentProfile.birthTime ? ` • ${currentProfile.birthTime}` : ''})
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-[#B8860B]/20 text-[#B8860B] font-serif font-bold text-[11px]">
                Chủ Đạo {currentProfile.lifePathDisplay}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-[#B8860B] flex items-center gap-1 mr-1">
                <Wand2 className="w-3.5 h-3.5" /> Mẫu:
              </span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`preset-btn-${idx}`}
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-sm border transition font-sans cursor-pointer ${
                    currentProfile?.fullName === preset.name
                      ? 'bg-[#B8860B]/20 border-[#B8860B] text-[#B8860B] font-medium'
                      : 'bg-[#05070A] hover:bg-[#B8860B]/15 text-[#94A3B8] hover:text-[#B8860B] border-[#B8860B]/20'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            id="toggle-form-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm bg-[#05070A] hover:bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/30 transition cursor-pointer ml-1"
            title={isCollapsed ? 'Mở rộng bảng nhập thông tin' : 'Thu gọn bảng nhập thông tin'}
          >
            {isCollapsed ? (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Đổi thông tin</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Thu gọn</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-[#B8860B]/20 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Full Name */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B8860B]" /> Họ và tên khai sinh:
            </label>
            <input
              id="input-fullname"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: NGUYỄN KHANH HÀ VY"
              className="w-full px-3.5 py-2.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] text-[#F3F4F6] placeholder-[#94A3B8]/40 text-sm transition outline-none"
            />
          </div>

          {/* Birth Date */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B8860B]" /> Ngày sinh:
            </label>
            <input
              id="input-birthdate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] text-[#F3F4F6] text-sm transition outline-none"
            />
          </div>

          {/* Birth Time (Optional) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B8860B]" /> Giờ sinh:
            </label>
            <input
              id="input-birthtime"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              placeholder="07:45"
              className="w-full px-3 py-2.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] text-[#F3F4F6] text-sm transition outline-none"
            />
          </div>

          {/* Gender Selection */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5">Giới tính:</label>
            <div className="grid grid-cols-3 gap-1">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  id={`gender-${g}`}
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-sm text-xs uppercase tracking-wider font-medium border transition cursor-pointer ${
                    gender === g
                      ? 'bg-[#B8860B] text-[#05070A] border-[#B8860B] font-bold shadow-sm'
                      : 'bg-[#05070A] text-[#94A3B8] border-[#B8860B]/20 hover:border-[#B8860B]/50 hover:text-[#F3F4F6]'
                  }`}
                >
                  {g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-12 flex justify-end mt-1">
            <button
              id="submit-numerology-calc"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-serif font-bold uppercase tracking-widest text-xs shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Giải Mã Toàn Diện</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
