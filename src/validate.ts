const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function isEmail(value: string): boolean {
  const email = value.trim();
  if (email.length > 254 || email.includes("..")) return false;
  if (!EMAIL.test(email)) return false;
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.startsWith("-") || domain.endsWith("-")) {
    return false;
  }
  return domain.split(".").every((part) => part.length > 0 && !part.startsWith("-") && !part.endsWith("-"));
}

export function isPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!/^[+\d][\d\s().-]{5,}$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}
