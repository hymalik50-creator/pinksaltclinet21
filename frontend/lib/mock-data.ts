import type { Category, Product, BlogPost } from './types';

const img = (id: number, w = 800, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const categories: Category[] = [
  {
    id: 'cat-1',
    slug: 'salt-lamps',
    name: 'Salt Lamps',
    description:
      'Hand-carved Himalayan salt lamps that purify the air and create a warm, calming ambience.',
    image: img(4386372, 1200, 800),
  },
  {
    id: 'cat-2',
    slug: 'edible-salt',
    name: 'Edible Salt',
    description:
      'Food-grade pink salt crystals, granules, and powder for culinary and gourmet use.',
    image: img(4386369, 1200, 800),
  },
  {
    id: 'cat-3',
    slug: 'bath-spa',
    name: 'Bath & Spa',
    description:
      'Bath salts, salt scrubs, and spa blocks for wellness and therapeutic use.',
    image: img(4386374, 1200, 800),
  },
  {
    id: 'cat-4',
    slug: 'decorative',
    name: 'Decorative',
    description:
      'Candleholders, bookends, and decorative salt sculptures crafted by artisans.',
    image: img(4386370, 1200, 800),
  },
  {
    id: 'cat-5',
    slug: 'industrial-salt',
    name: 'Industrial Salt',
    description:
      'Bulk industrial-grade salt for manufacturing, de-icing, and chemical applications.',
    image: img(4386376, 1200, 800),
  },
  {
    id: 'cat-6',
    slug: 'salt-cooking-plates',
    name: 'Cooking Plates',
    description:
      'Himalayan salt blocks and tiles for grilling, chilling, and plating.',
    image: img(4386371, 1200, 800),
  },
];

export const products: Product[] = [
  {
    id: 'p-1',
    slug: 'natural-himalayan-salt-lamp-medium',
    name: 'Natural Himalayan Salt Lamp — Medium',
    category: 'Salt Lamps',
    categoryId: 'cat-1',
    shortDescription:
      'Hand-mined 2-3 kg natural salt lamp with wooden base and dimmer.',
    description:
      'Our Natural Himalayan Salt Lamp is hand-mined from the Khewra Salt Range and shaped to preserve its organic, crystalline texture. Each lamp sits on a polished neem-wood base and includes a UL-listed dimmer cord. When lit, the warm amber glow releases negative ions that help neutralize airborne allergens and create a serene atmosphere in any room.',
    images: [img(4386372), img(4386373), img(4386374)],
    featured: true,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage:
      'Place in living rooms, bedrooms, or meditation spaces. Keep away from water and humidity.',
    packaging: ['Individual gift box', 'Carton of 12', 'Custom retail packaging'],
    sizes: ['1-2 kg', '2-3 kg', '3-5 kg', '5-7 kg'],
    availability: 'in-stock',
    minimumOrderQuantity: '100 pieces',
    exportInformation:
      'FOB Karachi. Documents: CO, packing list, commercial invoice, phytosanitary certificate on request.',
    specifications: {
      Weight: '2-3 kg',
      Height: '18-22 cm',
      Material: '100% natural Himalayan pink salt',
      Base: 'Polished neem wood',
      Power: '110-240V, 15W E14 bulb included',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'p-2',
    slug: 'pink-rock-coarse-salt-1kg',
    name: 'Pink Rock Coarse Salt — 1kg',
    category: 'Edible Salt',
    categoryId: 'cat-2',
    shortDescription:
      'Food-grade coarse pink salt crystals, 2-4mm, rich in trace minerals.',
    description:
      'Sourced from the Khewra mines and washed in spring water, our Pink Rock Coarse Salt contains 84 trace minerals including iron, potassium, and magnesium. The 2-4mm crystals are perfect for grinders, brining, and finishing dishes. Certified food-grade and tested for heavy metals.',
    images: [img(4386369), img(4386370)],
    featured: true,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage:
      'Use in salt grinders, brines, marinades, or as a finishing salt on meats and vegetables.',
    packaging: ['1kg stand-up pouch', '25kg food-grade bag', 'Custom retail pouch'],
    sizes: ['Fine (0-1mm)', 'Coarse (2-4mm)', 'Extra coarse (4-7mm)'],
    availability: 'in-stock',
    minimumOrderQuantity: '500 kg',
    exportInformation:
      'FOB Karachi. Food-grade packaging with HACCP documentation. Shelf life 36 months.',
    specifications: {
      'Crystal Size': '2-4 mm',
      'NaCl Content': '98.5% min',
      'Iron Content': '38 ppm',
      Moisture: '0.3% max',
      Packaging: 'Food-grade LDPE liner',
    },
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'p-3',
    slug: 'himalayan-bath-salt-jar-500g',
    name: 'Himalayan Bath Salt Jar — 500g',
    category: 'Bath & Spa',
    categoryId: 'cat-3',
    shortDescription:
      'Fine-milled pink bath salt in a reusable glass jar with bamboo lid.',
    description:
      'Relax and detoxify with our premium Himalayan Bath Salt. The fine 0.5-1mm crystals dissolve quickly in warm water, releasing trace minerals that soothe muscles and soften skin. Packed in a reusable 500g glass jar with a sustainable bamboo lid.',
    images: [img(4386374), img(4386375)],
    featured: true,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage:
      'Add 1-2 cups to warm bathwater and soak for 20 minutes. Not for consumption.',
    packaging: ['500g glass jar', '1kg refill pouch', 'Bulk 20kg bucket'],
    sizes: ['Fine (0.5-1mm)'],
    availability: 'in-stock',
    minimumOrderQuantity: '200 jars',
    exportInformation: 'FOB Karachi. Private label available. MOQ 1000 jars for custom labels.',
    specifications: {
      Weight: '500 g',
      'Crystal Size': '0.5-1 mm',
      Container: 'Glass jar with bamboo lid',
      Shelf: '24 months sealed',
    },
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z',
  },
  {
    id: 'p-4',
    slug: 'salt-candle-holder-set',
    name: 'Himalayan Salt Candle Holder Set',
    category: 'Decorative',
    categoryId: 'cat-4',
    shortDescription:
      'Set of 4 hand-carved tealight candleholders in graduated sizes.',
    description:
      'Each candleholder is carved from a single salt crystal and polished by hand. The set includes four graduated sizes that glow beautifully when lit. Includes 4 unscented tealights. A perfect gift or accent for any space.',
    images: [img(4386370), img(4386371)],
    featured: false,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage: 'Use with standard tealights. Keep on a heat-safe surface.',
    packaging: ['Set box of 4', 'Carton of 12 sets'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    availability: 'in-stock',
    minimumOrderQuantity: '50 sets',
    exportInformation: 'FOB Karachi. Custom inserts and branding available.',
    specifications: {
      'Set Contents': '4 candleholders + 4 tealights',
      Material: 'Natural Himalayan pink salt',
      Finish: 'Hand-polished',
    },
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
  },
  {
    id: 'p-5',
    slug: 'industrial-deicing-salt-bulk',
    name: 'Industrial De-Icing Salt — Bulk',
    category: 'Industrial Salt',
    categoryId: 'cat-5',
    shortDescription:
      'High-purity crushed salt for road de-icing and industrial applications.',
    description:
      'Our industrial-grade de-icing salt is crushed and screened to a consistent 2-6mm gradation. Treated with an anti-caking agent for free-flowing performance in spreaders. Ideal for municipalities, highways, and commercial snow removal.',
    images: [img(4386376), img(4386377)],
    featured: false,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage: 'Road de-icing, industrial brine, chemical manufacturing.',
    packaging: ['25kg bag', '1 ton super sack', 'Bulk vessel'],
    sizes: ['2-6 mm', '6-10 mm'],
    availability: 'made-to-order',
    minimumOrderQuantity: '20 metric tons',
    exportInformation:
      'FOB Karachi. Vessel or container shipments. Anti-caking treated.',
    specifications: {
      'NaCl Purity': '97% min',
      Gradation: '2-6 mm',
      'Anti-caking': 'Yes (sodium ferrocyanide)',
      Moisture: '0.5% max',
    },
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 'p-6',
    slug: 'himalayan-salt-cooking-block-20cm',
    name: 'Himalayan Salt Cooking Block — 20cm',
    category: 'Cooking Plates',
    categoryId: 'cat-6',
    shortDescription:
      '20cm square salt block for grilling, chilling, and presenting food.',
    description:
      'Cook, cure, and present on our 20cm Himalayan salt cooking block. Heat it on the grill or stove to sear meats and vegetables, or chill it in the freezer for serving sushi and desserts. Each block imparts a delicate saltiness and is naturally antibacterial.',
    images: [img(4386371), img(4386372)],
    featured: true,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage:
      'Heat gradually to avoid cracking. Clean with damp cloth — do not submerge.',
    packaging: ['Individual foam box', 'Carton of 8'],
    sizes: ['15cm', '20cm', '30cm'],
    availability: 'in-stock',
    minimumOrderQuantity: '100 blocks',
    exportInformation: 'FOB Karachi. Custom sizes available on request.',
    specifications: {
      Dimensions: '20 x 20 x 5 cm',
      Weight: 'approx 5 kg',
      Material: 'Solid Himalayan pink salt',
    },
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z',
  },
  {
    id: 'p-7',
    slug: 'fine-pink-salt-powder-500g',
    name: 'Fine Pink Salt Powder — 500g',
    category: 'Edible Salt',
    categoryId: 'cat-2',
    shortDescription:
      'Ultra-fine 0-0.5mm pink salt powder for seasoning and baking.',
    description:
      'Our finest grind of Himalayan pink salt, milled to 0-0.5mm for direct seasoning, baking, and popcorn. Packed in a resealable stand-up pouch with food-grade liner.',
    images: [img(4386369), img(4386374)],
    featured: false,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage: 'Direct seasoning, baking, popcorn, rimming glasses.',
    packaging: ['500g stand-up pouch', '5kg bag', '25kg bag'],
    sizes: ['Powder (0-0.5mm)'],
    availability: 'in-stock',
    minimumOrderQuantity: '300 kg',
    exportInformation: 'FOB Karachi. Private label available.',
    specifications: {
      'Crystal Size': '0-0.5 mm',
      'NaCl Content': '98.5% min',
      Packaging: 'Food-grade resealable pouch',
    },
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-05-18T10:00:00Z',
  },
  {
    id: 'p-8',
    slug: 'geode-salt-lamp-xl',
    name: 'Geode Salt Lamp — XL',
    category: 'Salt Lamps',
    categoryId: 'cat-1',
    shortDescription:
      'Extra-large 8-10kg natural geode-cut salt lamp with dimmer.',
    description:
      'Our largest natural lamp, the Geode XL features a cut-face that exposes the crystalline interior of the salt. Each piece is unique and weighs 8-10kg. Includes a heavy-duty dimmer cord and warm-white bulb.',
    images: [img(4386373), img(4386374)],
    featured: true,
    published: true,
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    usage: 'Statement piece for large living areas, lobbies, and studios.',
    packaging: ['Foam-packed individual carton', 'Pallet of 6'],
    sizes: ['8-10 kg'],
    availability: 'made-to-order',
    minimumOrderQuantity: '30 pieces',
    exportInformation: 'FOB Karachi. Palletized shipment.',
    specifications: {
      Weight: '8-10 kg',
      Height: '30-40 cm',
      Material: 'Natural Himalayan pink salt',
      Base: 'Reinforced neem wood',
    },
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-25T10:00:00Z',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'b-1',
    slug: 'benefits-of-himalayan-pink-salt',
    title: 'The Science-Backed Benefits of Himalayan Pink Salt',
    excerpt:
      'From trace minerals to air-purifying lamps, explore what makes Himalayan pink salt different from regular table salt.',
    content:
      'Himalayan pink salt is mined from the Khewra Salt Range in Pakistan, one of the oldest salt deposits on Earth. Its distinctive pink hue comes from trace minerals including iron, magnesium, potassium, and calcium. While nutritionally similar to table salt, many chefs and wellness enthusiasts prefer it for its texture, flavor, and mineral content.',
    coverImage: img(4386369, 1200, 800),
    author: 'HimalaSalt Editorial',
    publishedAt: '2024-05-10T10:00:00Z',
    tags: ['wellness', 'salt', 'minerals'],
  },
  {
    id: 'b-2',
    slug: 'how-to-care-for-your-salt-lamp',
    title: 'How to Care for Your Himalayan Salt Lamp',
    excerpt:
      'Keep your salt lamp glowing for years with these simple maintenance tips.',
    content:
      'Salt lamps are hygroscopic — they attract moisture. To keep yours in top condition, keep it away from humid areas, use it regularly (the warmth prevents moisture buildup), and wipe with a dry cloth if it becomes damp.',
    coverImage: img(4386372, 1200, 800),
    author: 'HimalaSalt Editorial',
    publishedAt: '2024-05-20T10:00:00Z',
    tags: ['salt lamps', 'care', 'tips'],
  },
  {
    id: 'b-3',
    slug: 'cooking-on-a-salt-block',
    title: 'Cooking on a Himalayan Salt Block: A Beginner\'s Guide',
    excerpt:
      'Learn how to heat, cook, and clean your salt block for perfect results every time.',
    content:
      'A salt block can be heated to 200°C or chilled to -20°C. Always heat gradually to avoid thermal shock. After cooking, let it cool completely and wipe with a damp cloth — never submerge in water.',
    coverImage: img(4386371, 1200, 800),
    author: 'HimalaSalt Editorial',
    publishedAt: '2024-06-01T10:00:00Z',
    tags: ['cooking', 'salt block', 'guide'],
  },
];
