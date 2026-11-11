export interface NumerologyProfile {
  id: string;
  fullName: string;
  normalizedName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm (optional)
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;

  // Core Numbers
  lifePath: number; // 2..11, 22, 33 (or standard 1..9, 11, 22, 33)
  lifePathDisplay: string; // e.g. "10", "11/2", "22/4", "33/6"
  destiny: number; // Expression Number (1..9, 11, 22, 33)
  soulUrge: number; // Heart's Desire (1..9, 11, 22, 33)
  personality: number; // Personality Number (1..9, 11, 22, 33)
  attitude: number; // Attitude Number (Day + Month)
  birthdayNumber: number; // Birthday Number (1..9, 11, 22)
  maturity: number; // Maturity Number (Life Path + Destiny)
  balanceNumber: number; // Balance Number (First letters)

  // Karmic & Passions
  karmicLessons: number[]; // Missing numbers in name (1..9)
  karmicDebts: string[]; // 13/4, 14/5, 16/7, 19/1
  hiddenPassions: number[]; // Most frequent numbers in name

  // Charts
  birthChartCounts: Record<number, number>; // 1..9 count from birth date
  nameChartCounts: Record<number, number>; // 1..9 count from name letters
  combinedChartCounts: Record<number, number>; // 1..9 count combined

  // Arrows (Mũi tên cá tính)
  activeArrows: ArrowInfo[];
  emptyArrows: ArrowInfo[];
  isolatedNumbers: number[]; // e.g. 1, 3, 7, 9 when isolated

  // 4 Pinnacles (Kim tự tháp 4 đỉnh cao)
  pinnacles: PinnacleItem[];

  // Personal Year & Cycles
  currentYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  universalYear: number;
}

export interface ArrowInfo {
  code: string; // e.g. "1-2-3", "4-5-6", "3-5-7"
  name: string; // e.g. "Mũi tên Kế hoạch", "Mũi tên Trống: Hỗn độn"
  type: 'strength' | 'weakness';
  numbers: number[];
  description: string;
  advice: string;
}

export interface PinnacleItem {
  peakNumber: number; // 1, 2, 3, 4
  age: number; // Age at this peak
  calendarYear: number; // Year in calendar
  value: number; // Calculated number (1..9, 11, 22)
  challengeValue: number; // Challenge number
  meaning: string;
  challengeMeaning: string;
}

export interface CompatibilityReport {
  overallScore: number; // 0..100%
  grade: 'Tuyệt hảo (Soulmate)' | 'Rất hòa hợp' | 'Khá tương hợp' | 'Bù trừ & Cần nỗ lực' | 'Thách thức lớn';
  lifePathMatch: {
    score: number;
    description: string;
  };
  soulUrgeMatch: {
    score: number;
    description: string;
  };
  destinyMatch: {
    score: number;
    description: string;
  };
  strengths: string[];
  challenges: string[];
  advice: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
