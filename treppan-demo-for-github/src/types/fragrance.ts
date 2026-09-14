export type FragranceCategory =
  | 'all'
  | 'Attar & Perfume'
  | 'Non-Alcoholic Perfume'
  | 'Aqua Parfum'
  | 'Pure Dehenal Oud'
  | 'Signature Coffrets'
  | 'Kasturi Musk & Attars'
  | string;

export interface OlfactoryPyramid {
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
}

export interface FragranceProduct {
  id: string;
  title: string;
  name: string;
  price: string;
  category: FragranceCategory | string;
  notes: string;
  images: string[];
  image: string;
  hoverImage: string;
  sizes?: string[];
  shortDescription?: string;
  description?: string;

  // Editorial & Heritage Details
  arabicName?: string;
  subtitle?: string;
  tagline?: string;
  subCategory?: string;
  volume?: string;
  badge?: string;
  isHero?: boolean;
  isExclusive?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  concentration?: string;
  concentrationBadge?: string;
  interactiveBadge?: string;
  formulationStory?: string;
  wearExperience?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  olfactoryPyramid?: OlfactoryPyramid;
  accordTags?: string[];
  relatedIds?: string[];
  concentrationVolume?: string;
  conciseNotes?: string;
}
