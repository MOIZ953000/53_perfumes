import * as THREE from 'three';

export interface PerfumeBottleAsset {
  id: string;
  name: string;
  arabicName: string;
  file: string;
  path: string;
  sizeBytes: number;
  sizeFormatted: string;
  subtitle: string;
  accords: string;
  targetScale: number;
  yOffset: number;
  accentColor: string;
  productId: string;
}

export const PERFUME_BOTTLE_ASSETS: PerfumeBottleAsset[] = [
  {
    id: 'treppan-fragrance-1',
    name: 'ONLY YOU',
    arabicName: 'اونلي يو اكوا بارفان',
    file: 'treppan-fragrance-1.glb',
    path: '/assets/treppan-fragrance-1.glb',
    sizeBytes: 1546700,
    sizeFormatted: '1.48 MB',
    subtitle: 'Aqua Parfum by Treppan 53',
    accords: 'Fresh • Bold • Unforgettable',
    targetScale: 1.68,
    yOffset: 0,
    accentColor: '#DFC27D',
    productId: 'trp-black'
  },
  {
    id: 'treppan-fragrance-2',
    name: 'AQUA DE',
    arabicName: 'اكوا دي بارفان',
    file: 'treppan-fragrance-2.glb',
    path: '/assets/treppan-fragrance-2.glb',
    sizeBytes: 1091172,
    sizeFormatted: '1.04 MB',
    subtitle: 'Aqua Parfum by Treppan',
    accords: 'Deep Aquatic • Clean Citrus • Pure Mineral',
    targetScale: 1.68,
    yOffset: 0,
    accentColor: '#60A5FA',
    productId: 'trp-bleu-de'
  },
  {
    id: 'treppan-fragrance-3',
    name: 'BLVGARI AQUA',
    arabicName: 'بولغاري اكوا ٥٣',
    file: 'treppan-fragrance-3.glb',
    path: '/assets/treppan-fragrance-3.glb',
    sizeBytes: 4699096,
    sizeFormatted: '4.48 MB',
    subtitle: 'Aqua Parfum • Best Seller',
    accords: 'Oceanic Woods • Mandarin • Crisp Amber',
    targetScale: 1.68,
    yOffset: 0,
    accentColor: '#C5A059',
    productId: 'trp-hero'
  }
];

export interface BottleSceneController {
  setActiveBottle: (index: number) => void;
  setRotation: (x: number, y: number, z: number) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setScale: (scale: number) => void;
  setExposure: (val: number) => void;
  getActiveBottleIndex: () => number;
  triggerSpin: (durationSeconds?: number) => void;
  resetTransform: () => void;
  setScrollProgress?: (progress: number) => void;
  getScene: () => THREE.Scene | null;
  getCamera: () => THREE.PerspectiveCamera | null;
}
