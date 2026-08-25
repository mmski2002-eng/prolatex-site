export function formatMm(mm: number): string {
  return `${(mm / 10).toFixed(0)} см`;
}

export function pluralYears(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "лет";
  if (mod10 === 1) return "год";
  if (mod10 >= 2 && mod10 <= 4) return "года";
  return "лет";
}

export function firmnessLabel(scale: number): string {
  if (scale <= 1) return "Мягкая";
  if (scale === 2) return "Мягкая";
  if (scale === 3) return "Средняя";
  if (scale === 4) return "Жёсткая";
  return "Экстра-жёсткая";
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidRuPhone(phone: string): boolean {
  const digits = normalizePhoneDigits(phone);
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return true;
  }
  if (digits.length === 10) return true;
  return false;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
