import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Подписанные токены доступа к партнёрским материалам.
 * Выдаются после отправки B2B-заявки, действуют 30 дней.
 * Файлы лежат вне public/, отдаются только через /api/partner/[file].
 */

const SECRET =
  process.env.PARTNER_SECRET ?? "prolatex-dev-secret-change-in-prod";

export const PARTNER_TOKEN_TTL_DAYS = 30;

function hmac(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 32);
}

/** Токен вида `<expMs>.<sig>` */
export function issuePartnerToken(): string {
  const exp = Date.now() + PARTNER_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${hmac(String(exp))}`;
}

export function verifyPartnerToken(token: string | null): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split(".", 2);
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = hmac(expStr);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
