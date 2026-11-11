import React from 'react';
import {
  Sparkles,
  Compass,
  HeartHandshake,
  TrendingUp,
  Bot,
  Briefcase,
  Printer,
  History,
  User,
} from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentProfile: NumerologyProfile | null;
  savedProfiles: NumerologyProfile[];
  onSelectProfile: (profile: NumerologyProfile) => void;
  onOpenSavedModal: () => void;
  onOpenPrintModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentProfile,
  savedProfiles,
  onSelectProfile,
  onOpenSavedModal,
  onOpenPrintModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Bản Đồ Số Mệnh', icon: Compass },
    { id: 'chart', label: 'Biểu Đồ & Mũi Tên', icon: Sparkles },
    { id: 'pyramid', label: 'Kim Tự Tháp & Vận Hạn', icon: TrendingUp },
    { id: 'compatibility', label: 'Bói Tương Hợp', icon: HeartHandshake },
    { id: 'career', label: 'Nghề Nghiệp & Tài Năng', icon: Briefcase },
    { id: 'ai-consultant', label: 'Cố Vấn AI Master', icon: Bot, badge: 'Gemini' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0D14]/95 backdrop-blur-md border-b border-[#B8860B]/30 text-[#F3F4F6] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand: Diamond Geometric Emblem */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 border-2 border-[#B8860B] rotate-45 flex items-center justify-center shrink-0 shadow-sm shadow-[#B8860B]/20">
              <span className="text-[#B8860B] font-bold -rotate-45 font-serif text-base">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl tracking-[0.2em] font-light uppercase font-serif text-[#F3F4F6]">
                  Aura Pythagoras
                </h1>
                <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30 uppercase">
                  Balance
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#94A3B8] hidden sm:block">
                Ma Trận Số Học Thiêng Liêng
              </p>
            </div>
          </div>

          {/* Quick Profile Switcher / Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentProfile && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-xs">
                <User className="w-3.5 h-3.5 text-[#B8860B]" />
                <span className="font-serif text-[#F3F4F6] truncate max-w-[120px]">
                  {currentProfile.fullName}
                </span>
                <span className="px-1.5 py-0.5 rounded-sm bg-[#B8860B]/20 text-[#B8860B] font-bold text-[10px] font-serif">
                  Số {currentProfile.lifePathDisplay}
                </span>
              </div>
            )}

            {/* Saved Profiles Button */}
            <button
              id="saved-profiles-btn"
              onClick={onOpenSavedModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#05070A] hover:bg-[#B8860B]/10 border border-[#B8860B]/30 text-xs uppercase tracking-wider font-medium text-[#94A3B8] hover:text-[#B8860B] transition"
              title="Danh sách hồ sơ đã lưu"
            >
              <History className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="hidden sm:inline">Hồ Sơ ({savedProfiles.length})</span>
            </button>

            {/* Print/Export Button */}
            {currentProfile && (
              <button
                id="print-report-btn"
                onClick={onOpenPrintModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#B8860B]/20 hover:bg-[#B8860B]/30 border border-[#B8860B]/50 text-xs uppercase tracking-wider font-semibold text-[#F3F4F6] transition shadow-sm"
                title="Xuất bản báo cáo chi tiết"
              >
                <Printer className="w-3.5 h-3.5 text-[#B8860B]" />
                <span className="hidden sm:inline">Báo Cáo PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-2.5 pt-1 scrollbar-none border-t border-[#B8860B]/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#B8860B]/15 text-[#B8860B] border-b-2 border-[#B8860B] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F3F4F6] hover:bg-[#05070A]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8860B]' : 'text-[#94A3B8]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-[#B8860B] text-[#05070A] uppercase tracking-normal">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
