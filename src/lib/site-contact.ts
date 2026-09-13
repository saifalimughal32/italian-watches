/**
 * Public contact settings for the storefront.
 *
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel / .env (digits + country code, no +).
 * Example: 923001234567
 *
 * Or update WHATSAPP_FALLBACK below.
 */
const WHATSAPP_FALLBACK = "";

export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_FALLBACK
).replace(/\D/g, "");

export function buildWhatsAppUrl(message?: string) {
  if (!WHATSAPP_NUMBER) return null;
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  if (message?.trim()) {
    url.searchParams.set("text", message.trim());
  }
  return url.toString();
}
