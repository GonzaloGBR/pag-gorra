export interface Product {
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  materials: string[];
  care: string[];
}

export const products: Product[] = [
  {
    slug: 'apex-blackout',
    name: 'THE APEX BLACKOUT',
    price: 45,
    currency: 'USD',
    image: '/images/caps/black-baseball.png',
    description:
      'Engineered for minimalists. The Apex Blackout is constructed with precision-milled twill and features an unstructured crown for a perfectly relaxed fit. Designed to be a silent staple in your daily uniform.',
    materials: ['100% Cotton Twill', 'Matte Black Hardware', 'Tonal Embroidery'],
    care: ['Hand wash cold', 'Do not bleach', 'Line dry in shade'],
  },
  {
    slug: 'coastal-navy',
    name: 'COASTAL NAVY TRUCKER',
    price: 42,
    currency: 'USD',
    image: '/images/caps/navy-trucker.png',
    description:
      'Deep navy twill with a structured crown and breathable mesh back. Built for long days and clean lines—no logos, no noise.',
    materials: ['Cotton Twill Front', 'Poly Mesh Back', 'Adjustable Snap'],
    care: ['Spot clean', 'Air dry', 'Do not iron brim'],
  },
  {
    slug: 'vintage-sand',
    name: 'VINTAGE SAND CAP',
    price: 40,
    currency: 'USD',
    image: '/images/caps/beige-vintage.png',
    description:
      'Sun-washed beige with a low profile and soft unstructured fit. Feels broken-in from day one.',
    materials: ['Washed Cotton Canvas', 'Tonal Stitching', 'Metal Buckle'],
    care: ['Hand wash cold', 'Reshape while damp', 'Dry flat'],
  },
  {
    slug: 'minimal-white',
    name: 'MINIMAL WHITE',
    price: 38,
    currency: 'USD',
    image: '/images/caps/white-minimal.png',
    description:
      'Crisp white canvas, micro logo, maximum negative space. The cap for editors and athletes alike.',
    materials: ['Heavyweight Cotton', 'Embroidered Mark', 'Curved Brim'],
    care: ['Hand wash only', 'No bleach', 'Line dry'],
  },
  {
    slug: 'delimited-run',
    name: 'DELIMITED RUN 01',
    price: 52,
    currency: 'USD',
    image: '/images/caps/navy-trucker.png',
    description:
      'Numbered drop with contrast under-brim and interior taping. Once the run ends, the grid goes dark.',
    materials: ['Double-layer Twill', 'Numbered Interior Label', 'Suede Visor'],
    care: ['Dry clean only', 'Store on crown', 'Keep away from moisture'],
  },
  {
    slug: 'studio-grey',
    name: 'STUDIO GREY FIELD',
    price: 44,
    currency: 'USD',
    image: '/images/caps/beige-vintage.png',
    description:
      'Neutral grey tuned for product photography—and for disappearing into your rotation.',
    materials: ['Brushed Cotton', 'Tonal Eyelets', 'Soft Buckle'],
    care: ['Machine wash cold', 'Gentle cycle', 'Tumble dry low'],
  },
  {
    slug: 'trail-ink',
    name: 'TRAIL INK PERFORMANCE',
    price: 48,
    currency: 'USD',
    image: '/images/caps/black-baseball.png',
    description:
      'Lightweight black ripstop with laser-cut vents. Made to move, not to shout.',
    materials: ['Ripstop Nylon', 'Laser Perforation', 'Reflective Tag'],
    care: ['Wipe clean', 'Do not machine wash', 'Air dry'],
  },
  {
    slug: 'archive-cream',
    name: 'ARCHIVE CREAM',
    price: 41,
    currency: 'USD',
    image: '/images/caps/white-minimal.png',
    description:
      'Archived colorway brought back for the infinite canvas. Cream crown, raw brim edge.',
    materials: ['Organic Cotton', 'Raw Edge Brim', 'Woven Label'],
    care: ['Hand wash', 'Use mild detergent', 'Dry in shade'],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const capImages = [
  { file: 'navy-trucker.png', alt: 'Gorra trucker navy' },
  { file: 'beige-vintage.png', alt: 'Gorra vintage beige' },
  { file: 'white-minimal.png', alt: 'Gorra blanca minimal' },
  { file: 'black-baseball.png', alt: 'Gorra negra premium' },
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

  const placements: Array<{
    id: string;
    slug: string;
    x: number;
    y: number;
    w: number;
    h: number;
    image: string;
    alt: string;
  }> = [];

  let index = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const img = capImages[index % capImages.length];
      const product = products[index % products.length];
      const x =
        ORIGIN_X + col * CELL_W + (row % 2 === 1 ? STAGGER_X : 0) + ((index * 17) % 24) - 12;
      const y = ORIGIN_Y + row * CELL_H + ((index * 13) % 20) - 10;

      placements.push({
        id: `cap-${row}-${col}`,
        slug: product.slug,
        x,
        y,
        w: HAT_W,
        h: HAT_H,
        image: `/images/caps/${img.file}`,
        alt: img.alt,
      });
      index++;
    }
  }

  return placements;
}
