export type FragranceCategory = 'all' | 'aqua-parfum' | 'oud' | 'musk' | 'combos';

export interface OlfactoryPyramid {
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
}

export interface FragranceProduct {
  id: string;
  name: string;
  arabicName: string;
  subtitle: string;
  tagline: string;
  category: FragranceCategory;
  subCategory: string;
  volume: string;
  badge: string;
  isHero?: boolean;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  concentration: string;
  concentrationBadge: string;
  interactiveBadge: string;
  sizes: string[];
  description: string;
  formulationStory: string;
  wearExperience: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  olfactoryPyramid: OlfactoryPyramid;
  accordTags: string[];
  relatedIds?: string[];
  price: number;
  concentrationVolume?: string;
  conciseNotes?: string;
}
