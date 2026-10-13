/**
 * Your WhatsApp number, with country code and no spaces or plus sign.
 * Example for Portugal: "351912345678"
 * Guests open a chat to this number with the booking already written.
 */
export const WHATSAPP_NUMBER = "";

export function whatsappReady(): boolean {
  return WHATSAPP_NUMBER.replace(/\D/g, "").length > 0;
}

export function whatsappHref(message: string): string | null {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const SITE_URL = "https://www.discoverthebestofthealgarve.com";
