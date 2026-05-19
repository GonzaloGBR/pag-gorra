export const WHATSAPP_PRIMARY = '3875075281';
export const WHATSAPP_SECONDARY = '3875055087';

export function whatsappUrl(phone: string, message: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productWhatsAppMessage(productName: string, price: number, currency: string): string {
  return `Hola MLCAPS, quiero comprar: ${productName} ($${price.toFixed(2)} ${currency})`;
}
