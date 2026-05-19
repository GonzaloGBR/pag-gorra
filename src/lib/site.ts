import { WHATSAPP_PRIMARY, WHATSAPP_SECONDARY, whatsappUrl } from './whatsapp';

export const INSTAGRAM_URL =
  'https://www.instagram.com/mlcaps.2?igsh=MW94N3JoNW93dDFmaA%3D%3D';

export const WHATSAPP_NAV_MESSAGE = 'Hola MLCAPS, quiero consultar por una gorra.';

export const navLinks = [
  { href: '/', label: 'Colección', key: 'coleccion' as const },
  { href: '/#locales', label: 'Locales', key: null },
  { href: '/#contacto', label: 'Contacto', key: null },
] as const;

export type NavActive = 'coleccion' | 'none';

export const whatsappFooterLinks = [
  { label: '+54 387 507-5281', href: whatsappUrl(WHATSAPP_PRIMARY, '') },
  { label: '+54 387 505-5087', href: whatsappUrl(WHATSAPP_SECONDARY, '') },
] as const;
