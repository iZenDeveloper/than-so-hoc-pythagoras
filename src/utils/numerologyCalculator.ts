import {
  NumerologyProfile,
  ArrowInfo,
  PinnacleItem,
  CompatibilityReport,
} from '../types/numerology';

// Pythagorean Letter to Number Mapping
export const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

// Normalize Vietnamese Diacritics to Standard Latin
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  let result = str
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  result = result
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[ÌÍỊỈĨ]/g, 'I')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[ỲÝỴỶỸ]/g, 'Y');

  return result;
}

// Reduce number to single digit or master numbers (11, 22, 33)
export function reduceNumber(num: number, keepMaster = true, keepTen = false): number {
  if (keepMaster && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  if (keepTen && num === 10) {
    return 10;
  }
  if (num <= 9 && num > 0) {
    return num;
  }
  if (num === 0) return 0;

  const sum = String(num)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  if (keepMaster && (sum === 11 || sum === 22 || sum === 33)) {
    return sum;
  }
  if (keepTen && sum === 10) {
    return 10;
  }
  if (sum > 9) {
    return reduceNumber(sum, keepMaster, keepTen);
  }
  return sum;
}

// Check if a character at index is a vowel (including contextual 'Y')
// Rule: Y là nguyên âm khi KHÔNG đứng cạnh nguyên âm khác (A, E, I, O, U)
export function isVowel(char: string, index: number, word: string): boolean {
  const c = char.toUpperCase();
  if (['A', 'E', 'I', 'O', 'U'].includes(c)) {
    return true;
  }
  if (c === 'Y') {
    const upperWord = word.toUpperCase();
    const prevChar = index > 0 ? upperWord[index - 1] : '';
    const nextChar = index < upperWord.length - 1 ? upperWord[index + 1] : '';
    const isPrevVowel = ['A', 'E', 'I', 'O', 'U'].includes(prevChar);
    const isNextVowel = ['A', 'E', 'I', 'O', 'U'].includes(nextChar);

    // Y là nguyên âm khi không đứng cạnh nguyên âm nào khác
    if (!isPrevVowel && !isNextVowel) {
      return true;
    }
    return false;
  }
  return false;
}

// Calculate Life Path Number (Standard Pythagoras & Master Numbers 11, 22, 33 and 10)
export function calculateLifePath(day: number, month: number, year: number): { value: number; display: string } {
  // Direct sum method (Pythagoras School of David Phillips):
  // Sum all individual digits of D-M-YYYY
  const dateStr = `${day}${month}${year}`;
  const totalSum = dateStr.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);

  let reduced = totalSum;
  while (reduced > 11 && reduced !== 22 && reduced !== 33) {
    reduced = String(reduced)
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }

  let display = String(reduced);
  if (reduced === 10) display = "10";
  else if (reduced === 11) display = "11/2";
  else if (reduced === 22) display = "22/4";
  else if (reduced === 33) display = "33/6";

  return { value: reduced, display };
}

// Calculate 4 Core Pinnacle Peaks & Challenges
export function calculatePinnacles(
  day: number,
  month: number,
  year: number,
  lifePath: number,
  birthYear: number
): PinnacleItem[] {
  // Base numbers
  const nodeA = reduceNumber(month, false); // Month (1..9)
  const nodeB = reduceNumber(day, false);   // Day (1..9)
  const nodeC = reduceNumber(year, false);  // Year (1..9)

  // Standard Pythagoras age rule: 36 - LifePath (for master numbers 11 -> 2 or 11, 22 -> 4, 10 -> 10 or 1)
  let normalizedLifePath = lifePath;
  if (lifePath === 22) normalizedLifePath = 4;
  else if (lifePath === 33) normalizedLifePath = 6;
  else if (lifePath === 11) normalizedLifePath = 2;
  else if (lifePath === 10) normalizedLifePath = 10;

  const peak1Age = Math.max(25, 36 - (normalizedLifePath === 10 ? 10 : normalizedLifePath));
  const peak2Age = peak1Age + 9;
  const peak3Age = peak2Age + 9;
  const peak4Age = peak3Age + 9;

  // Values (Peaks allow Master numbers in higher peaks, standard 1..11)
  const peak1Val = reduceNumber(nodeA + nodeB, true, true);
  const peak2Val = reduceNumber(nodeB + nodeC, true, true);
  const peak3Val = reduceNumber(peak1Val + peak2Val, true, true);
  const peak4Val = reduceNumber(nodeA + nodeC, true, true);

  // Challenges (Positive difference)
  const ch1 = Math.abs(nodeA - nodeB);
  const ch2 = Math.abs(nodeB - nodeC);
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(nodeA - nodeC);

  const getPeakMeaning = (val: number) => {
    switch (val) {
      case 1: return 'Giai đoạn độc lập, tự chủ, tiên phong khởi nghiệp và khẳng định bản lĩnh cá nhân.';
      case 2: return 'Giai đoạn phát triển trực giác, hợp tác, kết nối tình cảm và sự hòa giải.';
      case 3: return 'Giai đoạn mở rộng tư duy, sáng tạo nghệ thuật, giao tiếp và tỏa sáng trí tuệ.';
      case 4: return 'Giai đoạn xây dựng nền tảng vật chất, kỷ luật, tổ chức và sự nghiệp vững chắc.';
      case 5: return 'Giai đoạn bứt phá tự do, du lịch khám phá, thay đổi và chuyển mình mạnh mẽ.';
      case 6: return 'Giai đoạn thăng hoa tình yêu, gia đình, chăm sóc cộng đồng và sự sáng tạo.';
      case 7: return 'Giai đoạn học hỏi chiều sâu, chiêm nghiệm triết lý, tâm linh và hoàn thiện tri thức.';
      case 8: return 'Giai đoạn gặt hái tài chính, quyền lực, danh tiếng và thành công kinh doanh.';
      case 9: return 'Giai đoạn hoàn thành sứ mệnh nhân đạo, cống hiến giá trị lớn và nâng tầm linh hồn.';
      case 10: return 'Giai đoạn thăng hoa năng lượng lãnh đạo, tái sinh và kiến tạo cột mốc phi thường.';
      case 11: return 'Đỉnh cao tâm linh bậc thầy, truyền cảm hứng và dẫn dắt tinh thần cộng đồng.';
      case 22: return 'Đỉnh cao kiến tạo vĩ đại (Master Builder), xây dựng những công trình để đời.';
      default: return 'Giai đoạn chuyển mình và tích lũy phước đức.';
    }
  };

  const getChallengeMeaning = (val: number) => {
    switch (val) {
      case 0: return 'Thách thức tổng hòa: Bạn có nhiều lựa chọn, cần rèn luyện ý chí tự thân không ỷ lại.';
      case 1: return 'Thách thức về cái tôi: Cần học cách tự lập mà không độc đoán hay áp đặt người khác.';
      case 2: return 'Thách thức về cảm xúc: Cần kiểm soát tính nhạy cảm quá mức, tránh tự ái và sợ hãi mâu thuẫn.';
      case 3: return 'Thách thức về biểu đạt: Tránh nói năng tùy hứng, dàn trải năng lượng, cần tập trung chiều sâu.';
      case 4: return 'Thách thức về tính kỷ luật: Tránh sự lười biếng, cứng nhắc hoặc quá tham công tiếc việc.';
      case 5: return 'Thách thức về sự bốc đồng: Tránh thay đổi thất thường, buông thả ham muốn nhất thời.';
      case 6: return 'Thách thức về kỳ vọng: Tránh kiểm soát người thân thái quá hoặc hy sinh mù quáng.';
      case 7: return 'Thách thức về niềm tin: Tránh hoài nghi cực đoan, tự cô lập mình trong nỗi cô đơn.';
      case 8: return 'Thách thức về tiền bạc & quyền lực: Tránh tham vọng vật chất mù quáng, rèn luyện sự chính trực.';
      default: return 'Thách thức rèn luyện tâm tính và thích nghi với hoàn cảnh.';
    }
  };

  return [
    {
      peakNumber: 1,
      age: peak1Age,
      calendarYear: birthYear + peak1Age,
      value: peak1Val,
      challengeValue: ch1,
      meaning: getPeakMeaning(peak1Val),
      challengeMeaning: getChallengeMeaning(ch1),
    },
    {
      peakNumber: 2,
      age: peak2Age,
      calendarYear: birthYear + peak2Age,
      value: peak2Val,
      challengeValue: ch2,
      meaning: getPeakMeaning(peak2Val),
      challengeMeaning: getChallengeMeaning(ch2),
    },
    {
      peakNumber: 3,
      age: peak3Age,
      calendarYear: birthYear + peak3Age,
      value: peak3Val,
      challengeValue: ch3,
      meaning: getPeakMeaning(peak3Val),
      challengeMeaning: getChallengeMeaning(ch3),
    },
    {
      peakNumber: 4,
      age: peak4Age,
      calendarYear: birthYear + peak4Age,
      value: peak4Val,
      challengeValue: ch4,
      meaning: getPeakMeaning(peak4Val),
      challengeMeaning: getChallengeMeaning(ch4),
    },
  ];
}

// Detect Active & Empty Arrows in 3x3 Chart
export function detectArrows(counts: Record<number, number>): {
  active: ArrowInfo[];
  empty: ArrowInfo[];
  isolated: number[];
} {
  const active: ArrowInfo[] = [];
  const empty: ArrowInfo[] = [];

  const ARROW_DEFINITIONS = [
    {
      code: '1-2-3',
      name: 'Mũi tên Kế Hoạch & Tổ Chức',
      emptyName: 'Mũi tên Trống: Kế Hoạch Lộn Xộn / Thụ Động',
      numbers: [1, 2, 3],
      strengthDesc: 'Tư duy logic xuất sắc, có tài sắp xếp trật tự, hoạch định kế hoạch chu toàn và chi tiết.',
      strengthAdvice: 'Phát huy khả năng quản lý dự án, nhưng cần linh hoạt thích ứng khi có biến số bất ngờ.',
      weaknessDesc: 'Dễ làm việc theo cảm tính, gặp khó khăn khi lập kế hoạch dài hạn hoặc dễ bị rối loạn trước việc lớn.',
      weaknessAdvice: 'Tập ghi chép todo-list hàng ngày, chia nhỏ mục tiêu lớn thành từng bước nhỏ khả thi.',
    },
    {
      code: '4-5-6',
      name: 'Mũi tên Ý Chí & Quyết Tâm',
      emptyName: 'Mũi tên Trống: Bất An & Uất Giận',
      numbers: [4, 5, 6],
      strengthDesc: 'Ý chí sắt đá, kiên cường vượt qua nghịch cảnh, bản lĩnh và không bao giờ lùi bước.',
      strengthAdvice: 'Tránh quá cứng nhắc hoặc gánh vác mọi việc một mình, học cách trao quyền cho người khác.',
      weaknessDesc: 'Dễ nảy sinh tâm lý thất vọng, buồn bực khi mọi việc không như ý hoặc thiếu kiên nhẫn.',
      weaknessAdvice: 'Thực hành thiền định, chấp nhận sự không hoàn hảo và học cách buông bỏ kỳ vọng quá cao.',
    },
    {
      code: '7-8-9',
      name: 'Mũi tên Hoạt Động & Trải Nghiệm',
      emptyName: 'Mũi tên Trống: Thụ Động & Trì Trệ',
      numbers: [7, 8, 9],
      strengthDesc: 'Năng động, thích xông pha thực chiến, không ngại thử thách và tích lũy vốn sống phong phú.',
      strengthAdvice: 'Cần cân bằng giữa hành động nhanh và suy xét kỹ lưỡng để tránh tổn thất không đáng có.',
      weaknessDesc: 'Dễ an phận thủ thường, ngại dấn thân vào những môi trường mới hoặc thích nằm trong vùng an toàn.',
      weaknessAdvice: 'Chủ động tham gia các hoạt động thể thao ngoài trời, học kỹ năng mới mỗi quý.',
    },
    {
      code: '1-4-7',
      name: 'Mũi tên Thực Tế & Khéo Léo',
      emptyName: 'Mũi tên Trống: Thiếu Thực Tế / Hỗn Độn',
      numbers: [1, 4, 7],
      strengthDesc: 'Đôi bàn tay khéo léo, óc thực tế bén nhạy, giỏi xoay sở thực tế và giải quyết vấn đề vật chất.',
      strengthAdvice: 'Hướng tới các ngành kỹ thuật, tài chính, nghệ thuật chế tác hoặc quản trị thực địa.',
      weaknessDesc: 'Dễ mơ mộng viển vông, khó hiện thực hóa ý tưởng thành kết quả vật chất cụ thể.',
      weaknessAdvice: 'Rèn luyện thói quen quản lý tài chính cá nhân chặt chẽ và học các kỹ năng thủ công thực tế.',
    },
    {
      code: '2-5-8',
      name: 'Mũi tên Cân Bằng Cảm Xúc',
      emptyName: 'Mũi tên Trống: Nhạy Cảm & Dễ Tổn Thương',
      numbers: [2, 5, 8],
      strengthDesc: 'Trực giác sâu sắc, tâm hồn nhạy bén, khả năng thấu cảm và giữ cân bằng cảm xúc tuyệt vời.',
      strengthAdvice: 'Rất hợp với các ngành tư vấn tâm lý, nghệ thuật, chữa lành và ngoại giao.',
      weaknessDesc: 'Tâm trạng thất thường, dễ bị tổn thương bởi lời nói của người khác, tự ti về cảm xúc.',
      weaknessAdvice: 'Học cách thiết lập ranh giới cảm xúc lành mạnh, không ôm đồm năng lượng tiêu cực của người khác.',
    },
    {
      code: '3-6-9',
      name: 'Mũi tên Trí Tuệ & Sáng Suốt',
      emptyName: 'Mũi tên Trống: Trí Nhớ Kém / Hay Quên',
      numbers: [3, 6, 9],
      strengthDesc: 'Trí tuệ thông thái, tư duy trừu tượng sắc bén, trí nhớ phi thường và năng khiếu học thuật.',
      strengthAdvice: 'Tránh tư duy kiêu ngạo hoặc xa rời thực tế, hãy ứng dụng tri thức để giúp ích cho đời.',
      weaknessDesc: 'Trí nhớ ngắn hạn kém, dễ sao nhãng, thiếu tập trung khi phải làm việc nhiều chi tiết.',
      weaknessAdvice: 'Sử dụng ứng dụng ghi chú, rèn luyện não bộ qua đọc sách sâu và các trò chơi tư duy.',
    },
    {
      code: '1-5-9',
      name: 'Mũi tên Quyết Tâm & Nghị Lực (Mũi tên Vàng)',
      emptyName: 'Mũi tên Trống: Trì Hoãn & Dễ Nản Lòng',
      numbers: [1, 5, 9],
      strengthDesc: 'Mũi tên quyền lực nhất về sự kiên định. Khi đã đặt mục tiêu, bạn sẽ làm đến cùng không từ bỏ.',
      strengthAdvice: 'Cần phân biệt giữa kiên định và cố chấp. Biết dừng lại đúng lúc khi con đường đã bế tắc.',
      weaknessDesc: 'Hay chần chừ, bắt đầu hào hứng nhưng nhanh chóng bỏ cuộc khi gặp trở ngại ban đầu.',
      weaknessAdvice: 'Áp dụng quy tắc 5 phút: Bắt tay vào làm ngay trong 5 phút đầu tiên để phá vỡ quán tính trì hoãn.',
    },
    {
      code: '3-5-7',
      name: 'Mũi tên Tâm Linh & Giác Quan',
      emptyName: 'Mũi tên Trống: Hoài Nghi & Đa Nghi',
      numbers: [3, 5, 7],
      strengthDesc: 'Giác quan thứ sáu cực nhạy, có năng khiếu chiêm nghiệm tâm linh và hiểu sâu quy luật vũ trụ.',
      strengthAdvice: 'Giữ tâm trong sáng, tránh mê tín dị đoan, dùng trực giác để dẫn đường cho đạo đức.',
      weaknessDesc: 'Thường nghi ngờ mọi thứ, khó đặt niềm tin vào người khác, dễ rơi vào trạng thái hoang mang.',
      weaknessAdvice: 'Mở rộng lòng đón nhận những trải nghiệm mới và học cách tin tưởng đồng đội.',
    },
  ];

  ARROW_DEFINITIONS.forEach((def) => {
    const hasAll = def.numbers.every((n) => (counts[n] || 0) > 0);
    const hasNone = def.numbers.every((n) => (counts[n] || 0) === 0);

    if (hasAll) {
      active.push({
        code: def.code,
        name: def.name,
        type: 'strength',
        numbers: def.numbers,
        description: def.strengthDesc,
        advice: def.strengthAdvice,
      });
    } else if (hasNone) {
      empty.push({
        code: def.code,
        name: def.emptyName,
        type: 'weakness',
        numbers: def.numbers,
        description: def.weaknessDesc,
        advice: def.weaknessAdvice,
      });
    }
  });

  // Check Isolated Numbers (Ốc đảo)
  const isolated: number[] = [];
  // 1 is isolated if counts[1]>0 and counts[2]==0, counts[4]==0, counts[5]==0
  if ((counts[1] || 0) > 0 && !counts[2] && !counts[4] && !counts[5]) isolated.push(1);
  // 3 is isolated if counts[3]>0 and counts[2]==0, counts[5]==0, counts[6]==0
  if ((counts[3] || 0) > 0 && !counts[2] && !counts[5] && !counts[6]) isolated.push(3);
  // 7 is isolated if counts[7]>0 and counts[4]==0, counts[5]==0, counts[8]==0
  if ((counts[7] || 0) > 0 && !counts[4] && !counts[5] && !counts[8]) isolated.push(7);
  // 9 is isolated if counts[9]>0 and counts[5]==0, counts[6]==0, counts[8]==0
  if ((counts[9] || 0) > 0 && !counts[5] && !counts[6] && !counts[8]) isolated.push(9);

  return { active, empty, isolated };
}

// Master Full Numerology Calculator
export function generateNumerologyProfile(
  fullName: string,
  birthDateStr: string,
  gender: 'male' | 'female' | 'other' = 'other',
  birthTime?: string
): NumerologyProfile {
  const cleanName = fullName.trim();
  const normalized = removeVietnameseTones(cleanName).toUpperCase();
  const words = normalized.split(/\s+/).filter(Boolean);

  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const birthYear = parseInt(yearStr, 10);
  const birthMonth = parseInt(monthStr, 10);
  const birthDay = parseInt(dayStr, 10);

  // 1. Life Path Number
  const { value: lifePath, display: lifePathDisplay } = calculateLifePath(birthDay, birthMonth, birthYear);

  // 2. Letters Breakdown (Vowels & Consonants)
  let totalNameSum = 0;
  let vowelsSum = 0;
  let consonantsSum = 0;
  const nameLetterCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const firstLettersOfWords: string[] = [];

  words.forEach((word) => {
    if (word.length > 0) {
      firstLettersOfWords.push(word[0]);
    }
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const val = LETTER_VALUES[char];
      if (val) {
        totalNameSum += val;
        nameLetterCounts[val] = (nameLetterCounts[val] || 0) + 1;

        if (isVowel(char, i, word)) {
          vowelsSum += val;
        } else {
          consonantsSum += val;
        }
      }
    }
  });

  // 3. Core Name Numbers
  const destiny = reduceNumber(totalNameSum, true);
  const soulUrge = reduceNumber(vowelsSum, true);
  const personality = reduceNumber(consonantsSum, true);
  const attitude = reduceNumber(birthDay + birthMonth, false);
  const birthdayNumber = reduceNumber(birthDay, true);
  const maturity = reduceNumber(lifePath + destiny, true);

  // 4. Balance Number (First letters)
  const balanceSum = firstLettersOfWords.reduce((acc, ch) => acc + (LETTER_VALUES[ch] || 0), 0);
  const balanceNumber = reduceNumber(balanceSum, false);

  // 5. Karmic Lessons (Missing numbers 1..9 in name)
  const karmicLessons: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!nameLetterCounts[i] || nameLetterCounts[i] === 0) {
      karmicLessons.push(i);
    }
  }

  // 6. Hidden Passions (Most frequent numbers)
  let maxCount = 0;
  for (let i = 1; i <= 9; i++) {
    if (nameLetterCounts[i] > maxCount) {
      maxCount = nameLetterCounts[i];
    }
  }
  const hiddenPassions: number[] = [];
  if (maxCount > 1) {
    for (let i = 1; i <= 9; i++) {
      if (nameLetterCounts[i] === maxCount) {
        hiddenPassions.push(i);
      }
    }
  }

  // 7. Karmic Debts Detection (13/4, 14/5, 16/7, 19/1 in intermediate sums)
  const karmicDebts: string[] = [];
  const checkKarmic = (sum: number) => {
    if (sum === 13) karmicDebts.push('13/4 (Nợ Nghiệp Lười Biếng / Trách Nhiệm)');
    if (sum === 14) karmicDebts.push('14/5 (Nợ Nghiệp Lạm Dụng Tự Do / Bất Ổn)');
    if (sum === 16) karmicDebts.push('16/7 (Nợ Nghiệp Tình Cảm / Bản Ngã Sụp Đổ)');
    if (sum === 19) karmicDebts.push('19/1 (Nợ Nghiệp Lạm Quyền / Bất Công)');
  };
  checkKarmic(birthDay);
  checkKarmic(totalNameSum);
  checkKarmic(vowelsSum);

  // 8. Birth Chart (3x3 Matrix)
  const birthChartCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const rawDateStr = `${birthDay}${birthMonth}${birthYear}`;
  for (const ch of rawDateStr) {
    const num = parseInt(ch, 10);
    if (num >= 1 && num <= 9) {
      birthChartCounts[num] = (birthChartCounts[num] || 0) + 1;
    }
  }

  // 9. Combined Chart
  const combinedChartCounts: Record<number, number> = { ...birthChartCounts };
  for (let i = 1; i <= 9; i++) {
    combinedChartCounts[i] = (combinedChartCounts[i] || 0) + (nameLetterCounts[i] || 0);
  }

  // 10. Arrows Detection
  const { active: activeArrows, empty: emptyArrows, isolated: isolatedNumbers } = detectArrows(birthChartCounts);

  // 11. 4 Pinnacles (Kim Tự Tháp)
  const pinnacles = calculatePinnacles(birthDay, birthMonth, birthYear, lifePath, birthYear);

  // 12. Personal Year, Month, Day (Current Date)
  const now = new Date();
  const currentCalendarYear = now.getFullYear();
  const currentCalendarMonth = now.getMonth() + 1;
  const currentCalendarDay = now.getDate();

  const universalYear = reduceNumber(currentCalendarYear, false);
  const personalYear = reduceNumber(birthDay + birthMonth + universalYear, false);
  const personalMonth = reduceNumber(personalYear + currentCalendarMonth, false);
  const personalDay = reduceNumber(personalMonth + currentCalendarDay, false);

  return {
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fullName: cleanName,
    normalizedName: normalized,
    birthDate: birthDateStr,
    birthTime,
    birthDay,
    birthMonth,
    birthYear,
    gender,
    createdAt: new Date().toISOString(),
    lifePath,
    lifePathDisplay,
    destiny,
    soulUrge,
    personality,
    attitude,
    birthdayNumber,
    maturity,
    balanceNumber,
    karmicLessons,
    karmicDebts: Array.from(new Set(karmicDebts)),
    hiddenPassions,
    birthChartCounts,
    nameChartCounts: nameLetterCounts,
    combinedChartCounts,
    activeArrows,
    emptyArrows,
    isolatedNumbers,
    pinnacles,
    currentYear: currentCalendarYear,
    personalYear,
    personalMonth,
    personalDay,
    universalYear,
  };
}

// Calculate Compatibility between 2 profiles
export function calculateCompatibility(
  p1: NumerologyProfile,
  p2: NumerologyProfile
): CompatibilityReport {
  // Compatibility Matrix for Life Paths
  // Harmonious pairs (e.g. 1-3-5-7, 2-4-8, 3-6-9, 11-22-33)
  const lp1 = p1.lifePath === 10 ? 1 : p1.lifePath === 11 ? 2 : p1.lifePath === 22 ? 4 : p1.lifePath === 33 ? 6 : p1.lifePath;
  const lp2 = p2.lifePath === 10 ? 1 : p2.lifePath === 11 ? 2 : p2.lifePath === 22 ? 4 : p2.lifePath === 33 ? 6 : p2.lifePath;

  const soul1 = p1.soulUrge === 11 ? 2 : p1.soulUrge === 22 ? 4 : p1.soulUrge === 33 ? 6 : p1.soulUrge;
  const soul2 = p2.soulUrge === 11 ? 2 : p2.soulUrge === 22 ? 4 : p2.soulUrge === 33 ? 6 : p2.soulUrge;

  const des1 = p1.destiny === 11 ? 2 : p1.destiny === 22 ? 4 : p1.destiny === 33 ? 6 : p1.destiny;
  const des2 = p2.destiny === 11 ? 2 : p2.destiny === 22 ? 4 : p2.destiny === 33 ? 6 : p2.destiny;

  // Life path diff score (40% weight)
  let lpScore = 75;
  if (lp1 === lp2) lpScore = 90;
  else if ((lp1 + lp2) % 2 === 0) lpScore = 85;
  else if (Math.abs(lp1 - lp2) === 3 || Math.abs(lp1 - lp2) === 6) lpScore = 95;
  else if ([1, 5, 7].includes(lp1) && [1, 5, 7].includes(lp2)) lpScore = 92;
  else if ([2, 4, 8].includes(lp1) && [2, 4, 8].includes(lp2)) lpScore = 94;
  else if ([3, 6, 9].includes(lp1) && [3, 6, 9].includes(lp2)) lpScore = 96;
  else lpScore = 70;

  // Soul Urge score (35% weight)
  let soulScore = 70;
  if (soul1 === soul2) soulScore = 95;
  else if (Math.abs(soul1 - soul2) === 2 || Math.abs(soul1 - soul2) === 4) soulScore = 88;
  else if ([3, 6, 9].includes(soul1) && [3, 6, 9].includes(soul2)) soulScore = 92;
  else soulScore = 75;

  // Destiny score (25% weight)
  let desScore = 70;
  if (des1 === des2) desScore = 90;
  else if ((des1 + des2) % 3 === 0) desScore = 88;
  else desScore = 78;

  const overallScore = Math.round(lpScore * 0.4 + soulScore * 0.35 + desScore * 0.25);

  let grade: CompatibilityReport['grade'] = 'Khá tương hợp';
  if (overallScore >= 90) grade = 'Tuyệt hảo (Soulmate)';
  else if (overallScore >= 82) grade = 'Rất hòa hợp';
  else if (overallScore >= 72) grade = 'Khá tương hợp';
  else if (overallScore >= 60) grade = 'Bù trừ & Cần nỗ lực';
  else grade = 'Thách thức lớn';

  return {
    overallScore,
    grade,
    lifePathMatch: {
      score: lpScore,
      description: `Sự kết hợp giữa Số Chủ Đạo ${p1.lifePath} và ${p2.lifePath} tạo nên trường năng lượng ${
        lpScore >= 85 ? 'cực kỳ hài hòa, cùng chung chí hướng và mục tiêu sống lớn.' : 'bù trừ qua lại, cần thấu hiểu góc nhìn của nhau.'
      }`,
    },
    soulUrgeMatch: {
      score: soulScore,
      description: `Tương thích tâm hồn (${p1.soulUrge} & ${p2.soulUrge}): ${
        soulScore >= 85 ? 'Hai bạn dễ dàng chạm đến cảm xúc sâu kín của nhau, không cần nói ra cũng hiểu.' : 'Cần cởi mở chia sẻ cảm xúc nhiều hơn để tránh hiểu lầm nội tâm.'
      }`,
    },
    destinyMatch: {
      score: desScore,
      description: `Tương thích sứ mệnh hành động (${p1.destiny} & ${p2.destiny}): Hỗ trợ tương hỗ trong công việc và dự định tương lai.`,
    },
    strengths: [
      `Khả năng bù đắp những điểm khuyết trong biểu đồ ngày sinh của nhau.`,
      `Sự tôn trọng lẫn nhau trong không gian riêng tư và khát vọng sự nghiệp.`,
      `Cùng truyền cảm hứng để cả hai phiên bản hoàn thiện hơn mỗi ngày.`,
    ],
    challenges: [
      `Cần học cách lắng nghe trong những lúc bất đồng quan điểm thay vì phản ứng ngay.`,
      `Tránh áp đặt thói quen hoặc tiêu chuẩn cá nhân lên đối phương.`,
    ],
    advice: [
      `Dành thời gian chất lượng mỗi tuần để tâm sự chân thành về những khúc mắc trong lòng.`,
      `Hãy coi sự khác biệt về năng lượng là cơ hội để cả hai cùng học bài học trưởng thành.`,
      `Khích lệ và ủng hộ ước mơ của nhau một cách vô điều kiện.`,
    ],
  };
}
