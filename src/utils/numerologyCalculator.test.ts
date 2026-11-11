// Unit test for Pythagoras Numerology Calculator (focus on Nguyen Khanh Ha Vy)
import {
  generateNumerologyProfile,
  isVowel,
  removeVietnameseTones,
  reduceNumber,
} from './numerologyCalculator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- RUNNING PYTHAGORAS NUMEROLOGY TEST SUITE ---');

// 1. Test Vietnamese tone and 'Đ' removal
const testDong = removeVietnameseTones('Đỗ Đình Đồng');
assert(testDong === 'Do Dinh Dong', `Đ->D tone removal: expected 'Do Dinh Dong', got '${testDong}'`);

const testVyName = removeVietnameseTones('Nguyễn Khanh Hà Vy');
assert(testVyName === 'Nguyen Khanh Ha Vy', `Normalize name: expected 'Nguyen Khanh Ha Vy', got '${testVyName}'`);

// 2. Test contextual 'Y' vowel rules:
// Y is a vowel when NOT adjacent to any other vowel (A, E, I, O, U)
assert(isVowel('Y', 1, 'VY') === true, "In 'VY', Y is NOT adjacent to other vowels -> MUST BE VOWEL (true)");
assert(isVowel('Y', 1, 'MY') === true, "In 'MY', Y is NOT adjacent to other vowels -> MUST BE VOWEL (true)");
assert(isVowel('Y', 1, 'LY') === true, "In 'LY', Y is NOT adjacent to other vowels -> MUST BE VOWEL (true)");
assert(isVowel('Y', 3, 'NGUYEN') === false, "In 'NGUYEN', Y is between U and E -> MUST BE CONSONANT (false)");
assert(isVowel('Y', 3, 'THUY') === false, "In 'THUY', Y is next to U -> MUST BE CONSONANT (false)");

// 3. Test Full Profile calculation for "Nguyễn Khanh Hà Vy", 21/02/2013, 07:45
const vyProfile = generateNumerologyProfile(
  'Nguyễn Khanh Hà Vy',
  '2013-02-21',
  'female',
  '07:45'
);

console.log('\n--- CALCULATED PROFILE RESULTS FOR VY ---');
console.log(`Họ tên: ${vyProfile.fullName}`);
console.log(`Ngày sinh: ${vyProfile.birthDate} | Giờ sinh: ${vyProfile.birthTime}`);
console.log(`Số Chủ Đạo (Life Path): ${vyProfile.lifePath} (Display: ${vyProfile.lifePathDisplay})`);
console.log(`Số Sứ Mệnh (Destiny): ${vyProfile.destiny}`);
console.log(`Số Linh Hồn (Soul Urge): ${vyProfile.soulUrge}`);
console.log(`Số Nhân Cách (Personality): ${vyProfile.personality}`);
console.log(`Số Thái Độ (Attitude): ${vyProfile.attitude}`);
console.log(`Số Ngày Sinh (Birthday): ${vyProfile.birthdayNumber}`);

// Assertions for Vy
assert(vyProfile.birthTime === '07:45', `BirthTime stored: got '${vyProfile.birthTime}'`);
assert(vyProfile.lifePath === 11, `Life Path for 21/02/2013: expected 11 (Master), got ${vyProfile.lifePath}`);
assert(vyProfile.lifePathDisplay === '11/2', `Life Path Display: expected '11/2', got '${vyProfile.lifePathDisplay}'`);
assert(vyProfile.soulUrge === 8, `Soul Urge (Linh Hồn) for 'Nguyễn Khanh Hà Vy': expected 8, got ${vyProfile.soulUrge}`);
assert(vyProfile.personality === 5, `Personality (Nhân Cách) for 'Nguyễn Khanh Hà Vy': expected 5, got ${vyProfile.personality}`);
assert(vyProfile.destiny === 4, `Destiny (Sứ Mệnh) for 'Nguyễn Khanh Hà Vy': expected 4, got ${vyProfile.destiny}`);

// THE CORE MATHEMATICAL AXIOM:
// Soul Urge + Personality MUST reduce to Destiny!
const sumSoulPersonality = reduceNumber(vyProfile.soulUrge + vyProfile.personality, true);
assert(
  sumSoulPersonality === vyProfile.destiny,
  `Soul Urge (${vyProfile.soulUrge}) + Personality (${vyProfile.personality}) = ${vyProfile.soulUrge + vyProfile.personality} -> reduced ${sumSoulPersonality} MUST equal Destiny (${vyProfile.destiny})`
);

assert(vyProfile.attitude === 5, `Attitude (Day 21->3 + Month 2 = 5): expected 5, got ${vyProfile.attitude}`);
assert(vyProfile.birthdayNumber === 3, `Birthday Number (21->3): expected 3, got ${vyProfile.birthdayNumber}`);

console.log('\n🎉 ALL PYTHAGORAS NUMEROLOGY TESTS PASSED PERFECTLY!\n');
