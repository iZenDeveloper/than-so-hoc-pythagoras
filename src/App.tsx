import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NumerologyForm } from './components/NumerologyForm';
import { OverviewCard } from './components/OverviewCard';
import { BirthChartGrid } from './components/BirthChartGrid';
import { PyramidOfLife } from './components/PyramidOfLife';
import { PersonalCycleForecast } from './components/PersonalCycleForecast';
import { CompatibilityTab } from './components/CompatibilityTab';
import { CareerTalentTab } from './components/CareerTalentTab';
import { AIConsultantChat } from './components/AIConsultantChat';
import { ExportReportModal } from './components/ExportReportModal';
import { SavedProfilesModal } from './components/SavedProfilesModal';
import { NumerologyProfile } from './types/numerology';
import { generateNumerologyProfile } from './utils/numerologyCalculator';
import { generateDeterministicDeepReading } from './utils/fallbackNumerology';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentProfile, setCurrentProfile] = useState<NumerologyProfile | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<NumerologyProfile[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // AI Deep Reading State
  const [deepReading, setDeepReading] = useState<string | null>(null);
  const [isDeepReadingLoading, setIsDeepReadingLoading] = useState(false);

  // Initialize on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pythagoras_profiles');
      if (stored) {
        const parsed: NumerologyProfile[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
          setCurrentProfile(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading saved profiles:', e);
    }

    // Default sample profile: Nguyễn Khanh Hà Vy (21/02/2013, 07:45, nữ)
    const defaultVyProfile = generateNumerologyProfile('Nguyễn Khanh Hà Vy', '2013-02-21', 'female', '07:45');

    try {
      const stored = localStorage.getItem('pythagoras_profiles');
      if (stored) {
        const parsed: NumerologyProfile[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingVyIdx = parsed.findIndex(
            (p) => p.fullName.toLowerCase().includes('hà vy') || p.fullName.toLowerCase().includes('ha vy')
          );
          if (existingVyIdx >= 0) {
            const vy = parsed[existingVyIdx];
            const others = parsed.filter((_, i) => i !== existingVyIdx);
            const reordered = [vy, ...others];
            setSavedProfiles(reordered);
            setCurrentProfile(vy);
            return;
          } else {
            const merged = [defaultVyProfile, ...parsed.slice(0, 19)];
            setSavedProfiles(merged);
            setCurrentProfile(defaultVyProfile);
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved profiles:', e);
    }

    setCurrentProfile(defaultVyProfile);
    setSavedProfiles([defaultVyProfile]);
  }, []);

  // Save profiles to localStorage
  const persistProfiles = (profiles: NumerologyProfile[]) => {
    setSavedProfiles(profiles);
    try {
      localStorage.setItem('pythagoras_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.error('Error saving profiles to localStorage:', e);
    }
  };

  const handleFormSubmit = (
    name: string,
    birthDate: string,
    gender: 'male' | 'female' | 'other',
    birthTime?: string
  ) => {
    const newProfile = generateNumerologyProfile(name, birthDate, gender, birthTime);
    setCurrentProfile(newProfile);
    setDeepReading(null); // Reset previous reading

    // Update saved profiles list if not existing
    const existingIdx = savedProfiles.findIndex(
      (p) => p.fullName.toLowerCase() === name.toLowerCase() && p.birthDate === birthDate
    );
    if (existingIdx >= 0) {
      const updated = [...savedProfiles];
      updated[existingIdx] = newProfile;
      persistProfiles(updated);
    } else {
      persistProfiles([newProfile, ...savedProfiles.slice(0, 19)]);
    }
  };

  const handleDeleteProfile = (id: string) => {
    const updated = savedProfiles.filter((p) => p.id !== id);
    persistProfiles(updated);
    if (currentProfile?.id === id) {
      setCurrentProfile(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleGenerateAIDeepReading = async () => {
    if (!currentProfile) return;
    setIsDeepReadingLoading(true);
    setActiveTab('ai-consultant');
    try {
      const res = await fetch('/api/numerology/ai-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
        }),
      });
      let readingText = '';
      if (res.ok) {
        const data = await res.json();
        readingText = data.reading;
      }
      if (!readingText) {
        readingText = generateDeterministicDeepReading(currentProfile);
      }
      setDeepReading(readingText);
    } catch (e) {
      console.warn('Network issue fetching AI reading, using deterministic Pythagoras engine:', e);
      setDeepReading(generateDeterministicDeepReading(currentProfile));
    } finally {
      setIsDeepReadingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#F3F4F6] selection:bg-[#B8860B]/30 selection:text-[#F3F4F6] font-sans antialiased relative overflow-x-hidden">
      {/* Sacred Geometric Background Grid */}
      <div className="fixed inset-0 geometric-grid-bg pointer-events-none opacity-60 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B8860B]/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentProfile={currentProfile}
        savedProfiles={savedProfiles}
        onSelectProfile={(p) => {
          setCurrentProfile(p);
          setDeepReading(null);
        }}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Numerology Search Form (Auto-compacts on sub-tabs to save screen space) */}
        <NumerologyForm
          onSubmit={handleFormSubmit}
          currentProfile={currentProfile}
          defaultCollapsed={activeTab !== 'overview'}
        />

        {/* Tab Views */}
        {currentProfile ? (
          <div>
            {activeTab === 'overview' && (
              <OverviewCard
                profile={currentProfile}
                onOpenAIDeepReading={handleGenerateAIDeepReading}
              />
            )}

            {activeTab === 'chart' && <BirthChartGrid profile={currentProfile} />}

            {activeTab === 'pyramid' && (
              <div className="space-y-8">
                <PyramidOfLife profile={currentProfile} />
                <PersonalCycleForecast profile={currentProfile} />
              </div>
            )}

            {activeTab === 'compatibility' && (
              <CompatibilityTab
                currentProfile={currentProfile}
                savedProfiles={savedProfiles}
              />
            )}

            {activeTab === 'career' && <CareerTalentTab profile={currentProfile} />}

            {activeTab === 'ai-consultant' && (
              <AIConsultantChat
                profile={currentProfile}
                initialDeepReading={deepReading}
                onGenerateDeepReading={handleGenerateAIDeepReading}
                isDeepReadingLoading={isDeepReadingLoading}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0A0D14] rounded-sm border border-[#B8860B]/20 relative geometric-corners">
            <h3 className="text-lg font-bold text-[#F3F4F6] font-serif">Chưa có hồ sơ được chọn</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Vui lòng nhập họ tên và ngày sinh để giải mã lá số thần số học theo ma trận Pythagoras.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#B8860B]/20 bg-[#0A0D14] py-8 text-center text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
            <p className="font-serif tracking-[0.25em] text-[#B8860B] uppercase text-xs">
              AURA PYTHAGORAS • GEOMETRIC BALANCE NUMEROLOGY
            </p>
            <div className="w-2 h-2 border border-[#B8860B] rotate-45" />
          </div>
          <p className="text-[11px] text-[#94A3B8]/70 tracking-wider">
            Giải mã vận mệnh qua những con số thiêng liêng và ma trận hình học cân bằng • Tích hợp Cố Vấn AI Master Pythagoras
          </p>
        </div>
      </footer>

      {/* Modals */}
      {currentProfile && (
        <ExportReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          profile={currentProfile}
          deepReading={deepReading}
        />
      )}

      <SavedProfilesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProfiles={savedProfiles}
        currentProfileId={currentProfile?.id}
        onSelectProfile={(p) => {
          setCurrentProfile(p);
          setDeepReading(null);
        }}
        onDeleteProfile={handleDeleteProfile}
        onNewProfile={() => {
          setActiveTab('overview');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
