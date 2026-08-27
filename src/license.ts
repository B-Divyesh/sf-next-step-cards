export const PRODUCT_SLUG = 'next-step-cards';
export const BILLING_BASE = import.meta.env.VITE_BILLING_BASE_URL || 'https://api.sociobot.in';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const ONE_DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason?: string }

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function write(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

function remove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
}

export function checkoutUrl(): string {
  return `${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/checkout`;
}

export function captureReturnedLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  const saved = write(LICENSE_KEY, token);
  remove(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return saved;
}

export function storeLicense(token: string): void {
  if (!write(LICENSE_KEY, token.trim())) throw new Error('This browser blocked local license storage.');
  remove(VERDICT_KEY);
}

export function hasOptimisticUnlock(): boolean {
  const token = read(LICENSE_KEY);
  if (!token) return false;
  try {
    const verdict = JSON.parse(read(VERDICT_KEY) ?? 'null') as Verdict | null;
    return verdict?.valid ?? true;
  } catch { return true; }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason?: string } | null> {
  const token = read(LICENSE_KEY);
  if (!token) return null;
  try {
    const cached = JSON.parse(read(VERDICT_KEY) ?? 'null') as Verdict | null;
    if (!force && cached && Date.now() - cached.checkedAt < ONE_DAY) return cached;
  } catch { /* verify again */ }
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) return null;
    const data = await response.json() as { valid: boolean; reason?: string };
    const verdict: Verdict = { valid: data.valid, reason: data.reason, checkedAt: Date.now() };
    write(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return null;
  }
}
