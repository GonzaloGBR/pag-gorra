export const WHATSAPP_PRIMARY = '3875075281';
export const WHATSAPP_SECONDARY = '3875055087';

export function whatsappUrl(phone: string, message: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productWhatsAppMessage(productName: string, price: number, currency: string): string {
  const precio =
    currency === 'USD'
      ? `u$s ${price.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
      : `${price} ${currency}`;
  return `Hola MLCAPS, quiero comprar la gorra ${productName} (${precio}).`;
}
