import React from 'react';
import { History, X, Trash2, UserCheck, Calendar, Sparkles, Plus } from 'lucide-react';
import { NumerologyProfile } from '../types/numerology';

interface SavedProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProfiles: NumerologyProfile[];
  currentProfileId?: string;
  onSelectProfile: (profile: NumerologyProfile) => void;
  onDeleteProfile: (id: string) => void;
  onNewProfile: () => void;
}

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  isOpen,
  onClose,
  savedProfiles,
  currentProfileId,
  onSelectProfile,
  onDeleteProfile,
  onNewProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0A0D14] border border-[#B8860B]/40 rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 geometric-corners">
        <div className="flex items-center justify-between pb-3 border-b border-[#B8860B]/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h3 className="text-sm sm:text-base font-normal text-[#F3F4F6] uppercase tracking-wider font-serif">
              Danh Sách Hồ Sơ Đã Lưu ({savedProfiles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm bg-[#05070A] border border-[#B8860B]/30 text-[#94A3B8] hover:text-[#F3F4F6] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: Create New Profile */}
        <button
          onClick={() => {
            onNewProfile();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-sm bg-[#B8860B]/15 hover:bg-[#B8860B]/25 border border-[#B8860B]/40 text-xs font-serif font-bold uppercase tracking-wider text-[#B8860B] flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tra Cứu Người Mới</span>
        </button>

        {/* Profiles List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {savedProfiles.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#94A3B8]">
              Chưa có hồ sơ nào được lưu. Hãy tra cứu hồ sơ đầu tiên!
            </div>
          ) : (
            savedProfiles.map((p) => {
              const isSelected = p.id === currentProfileId;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-sm border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#05070A] border-[#B8860B] shadow-md shadow-[#B8860B]/10'
                      : 'bg-[#05070A] border-[#B8860B]/20 hover:border-[#B8860B]/40'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectProfile(p);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#F3F4F6] uppercase">{p.fullName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm font-bold bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/30 font-serif">
                        Số {p.lifePathDisplay}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] flex items-center gap-3 mt-1">
                      <span>Sinh: {p.birthDate}</span>
                      <span>•</span>
                      <span>Sứ mệnh: {p.destiny}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectProfile(p);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-sm text-xs font-serif font-bold uppercase tracking-wider bg-[#0A0D14] hover:bg-[#B8860B] text-[#B8860B] hover:text-[#05070A] border border-[#B8860B]/30 transition cursor-pointer"
                    >
                      Chọn
                    </button>
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="p-1.5 rounded-sm text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#B8860B]/10 transition cursor-pointer"
                      title="Xóa hồ sơ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
