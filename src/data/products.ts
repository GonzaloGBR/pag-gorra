export interface Product {
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  /** Fotos extra para la ficha (incluye o repite la principal). */
  gallery?: { src: string; alt: string }[];
  /** Destacada en el centro del catálogo infinito. */
  featured?: boolean;
  description: string;
  materials: string[];
  care: string[];
}

const GOKU_BASE = '/images/caps/goku-capslab';

export const products: Product[] = [
  {
    slug: 'goku-capslab',
    name: 'GOKU CAPSLAB',
    price: 55,
    currency: 'USD',
    image: `${GOKU_BASE}/01-front.png`,
    featured: true,
    gallery: [
      { src: `${GOKU_BASE}/01-front.png`, alt: 'Vista frontal' },
      { src: `${GOKU_BASE}/02-front-angle.png`, alt: 'Vista diagonal' },
      { src: `${GOKU_BASE}/03-back-angle.png`, alt: 'Vista trasera' },
      { src: `${GOKU_BASE}/04-side.png`, alt: 'Vista lateral' },
    ],
    description:
      'Trucker CAPSLAB x Dragon Ball: panel frontal navy, malla naranja, parche bordado de Goku y visera con costura contrastada.',
    materials: [
      'Frente en twill de algodón',
      'Malla trasera en poliéster',
      'Parche bordado en el frente',
      'Cierre snapback ajustable',
    ],
    care: [
      'Limpieza localizada en el parche',
      'No sumergir la malla',
      'Secar a la sombra',
    ],
  },
  {
    slug: 'apex-blackout',
    name: 'APEX BLACKOUT',
    price: 45,
    currency: 'USD',
    image: '/images/caps/black-baseball.png',
    description:
      'Gorra negra de perfil bajo, sin estructura rígida en la corona. Tela twill de algodón con terminaciones mate. Pensada para el día a día sin logos ni distracciones.',
    materials: [
      'Twill de algodón 100 %',
      'Cierre y hebillas en negro mate',
      'Bordado tonal discreto',
    ],
    care: [
      'Lavado a mano con agua fría',
      'No usar blanqueador',
      'Secar a la sombra',
    ],
  },
  {
    slug: 'coastal-navy',
    name: 'NAVY COSTERA',
    price: 42,
    currency: 'USD',
    image: '/images/caps/navy-trucker.png',
    description:
      'Trucker en azul marino con frente de twill y red trasera transpirable. Corona con algo más de estructura para un perfil definido.',
    materials: [
      'Frente en twill de algodón',
      'Red de poliéster en la parte trasera',
      'Cierre ajustable con broche',
    ],
    care: [
      'Limpieza localizada con paño húmedo',
      'Secar al aire',
      'No planchar la visera',
    ],
  },
  {
    slug: 'vintage-sand',
    name: 'ARENA VINTAGE',
    price: 40,
    currency: 'USD',
    image: '/images/caps/beige-vintage.png',
    description:
      'Tono arena lavado, visera curva y calce relajado. La sensación es de una gorra ya usada, sin rigidez excesiva.',
    materials: [
      'Lona de algodón lavada',
      'Costuras en tono',
      'Hebilla metálica',
    ],
    care: [
      'Lavado a mano en frío',
      'Reacomodar la forma húmeda',
      'Secar en horizontal',
    ],
  },
  {
    slug: 'minimal-white',
    name: 'BLANCA MÍNIMA',
    price: 38,
    currency: 'USD',
    image: '/images/caps/white-minimal.png',
    description:
      'Blanco limpio, marca mínima y mucho espacio visual. Una pieza neutra que combina con cualquier look urbano o deportivo.',
    materials: [
      'Algodón pesado',
      'Marca bordada pequeña',
      'Visera curva',
    ],
    care: [
      'Solo lavado a mano',
      'Sin blanqueador',
      'Secar colgada a la sombra',
    ],
  },
  {
    slug: 'delimited-run',
    name: 'EDICIÓN DELIMITADA 01',
    price: 52,
    currency: 'USD',
    image: '/images/caps/navy-trucker.png',
    description:
      'Serie numerada con detalle en el interior de la visera y cinta interna contrastada. Cuando se agota el lote, no se repone.',
    materials: [
      'Doble capa de twill',
      'Etiqueta interior numerada',
      'Visera en gamuza',
    ],
    care: [
      'Lavado en seco recomendado',
      'Guardar apoyada en la corona',
      'Evitar humedad prolongada',
    ],
  },
  {
    slug: 'studio-grey',
    name: 'GRIS ESTUDIO',
    price: 44,
    currency: 'USD',
    image: '/images/caps/beige-vintage.png',
    description:
      'Gris neutro pensado para resaltar la forma del producto en foto y en uso. Encaja en rotaciones discretas sin robar protagonismo.',
    materials: [
      'Algodón cepillado',
      'Ojales en tono',
      'Hebilla suave al tacto',
    ],
    care: [
      'Lavado a máquina en frío, ciclo suave',
      'Secado en secarropas bajo',
    ],
  },
  {
    slug: 'trail-ink',
    name: 'TRAIL INK',
    price: 48,
    currency: 'USD',
    image: '/images/caps/black-baseball.png',
    description:
      'Ripstop negro liviano con ventilación láser. Pensada para moverse: poco peso, secado rápido, estética técnica sin exceso de branding.',
    materials: [
      'Nylon ripstop',
      'Perforaciones láser',
      'Etiqueta reflectiva pequeña',
    ],
    care: [
      'Limpiar con paño húmedo',
      'No lavar a máquina',
      'Secar al aire libre',
    ],
  },
  {
    slug: 'archive-cream',
    name: 'ARCHIVO CREMA',
    price: 41,
    currency: 'USD',
    image: '/images/caps/white-minimal.png',
    description:
      'Color archivo recuperado para el catálogo: corona crema y borde de visera sin rematar. Edición con carácter vintage contemporáneo.',
    materials: [
      'Algodón orgánico',
      'Borde de visera en crudo',
      'Etiqueta tejida',
    ],
    care: [
      'Lavado a mano',
      'Detergente suave',
      'Secar a la sombra',
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const capImages = [
  { file: 'navy-trucker.png', alt: 'Gorra trucker azul marino' },
  { file: 'beige-vintage.png', alt: 'Gorra beige estilo vintage' },
  { file: 'white-minimal.png', alt: 'Gorra blanca minimalista' },
  { file: 'black-baseball.png', alt: 'Gorra negra tipo baseball' },
] as const;

/** Genera muchas posiciones en una malla con espaciado y límites naturales. */
export function buildCapPlacements() {
  const COLS = 14;
  const ROWS = 11;
  const CELL_W = 300;
  const CELL_H = 320;
  const HAT_W = 220;
  const HAT_H = 220;
  const ORIGIN_X = 100;
  const ORIGIN_Y = 100;
  const STAGGER_X = 50;

  const featured = products.find((p) => p.featured);
  const CENTER_ROW = Math.floor(ROWS / 2);
  const CENTER_COL = Math.floor(COLS / 2);

  const placements: Array<{
    id: string;
    slug: string;
    x: number;
    y: number;
    w: number;
    h: number;
    image: string;
    alt: string;
    featured?: boolean;
  }> = [];

  let index = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isCenter = row === CENTER_ROW && col === CENTER_COL;
      const img = capImages[index % capImages.length];
      const product = isCenter && featured ? featured : products[index % products.length];
      const x =
        ORIGIN_X + col * CELL_W + (row % 2 === 1 ? STAGGER_X : 0) + ((index * 17) % 24) - 12;
      const y = ORIGIN_Y + row * CELL_H + ((index * 13) % 20) - 10;
      const isFeatured = Boolean(isCenter && featured);

      placements.push({
        id: `cap-${row}-${col}`,
        slug: product.slug,
        x,
        y,
        w: isFeatured ? HAT_W + 24 : HAT_W,
        h: isFeatured ? HAT_H + 24 : HAT_H,
        image: isFeatured && featured ? featured.image : `/images/caps/${img.file}`,
        alt: isFeatured ? `${product.name} — vista frontal` : `${product.name} — ${img.alt}`,
        featured: isFeatured,
      });
      index++;
    }
  }

  return placements;
}
