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

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** ISO «2026-08-25» → «25 августа 2026». */
export function formatDateRu(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_RU[m - 1]} ${y}`;
}

/** Маска ввода российского номера: любой ввод → «+7 (999) 123-45-67». */
export function formatRuPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);
  const a = digits.slice(1, 4);
  const b = digits.slice(4, 7);
  const c = digits.slice(7, 9);
  const d = digits.slice(9, 11);
  let out = "+7";
  if (a) out += ` (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (d) out += `-${d}`;
  return out;
}

/** 25119 → «от 25 119 ₽». Пробелы неразрывные, чтобы цена не ломалась переносом. */
export function priceFrom(value: number): string {
  return `от\u00A0${value.toLocaleString("ru-RU").replace(/\s/g, "\u00A0")}\u00A0₽`;
}

/** 4800 → «4 800 ₽». Пробелы неразрывные. */
export function priceRub(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/\s/g, "\u00A0")}\u00A0₽`;
}
