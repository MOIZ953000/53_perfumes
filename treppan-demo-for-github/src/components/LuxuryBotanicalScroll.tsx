import React from 'react';
import { FragranceProduct } from '../types/fragrance';
import { EditorialBottleScroll } from './EditorialBottleScroll';

export interface LuxuryBotanicalScrollProps {
  onSelectProduct: (product: FragranceProduct) => void;
}

/**
 * LuxuryBotanicalScroll:
 * The signature 3-chapter pinned 3D editorial showcase binding the 3 perfume flacons
 * to a smooth lerped RAF scroll container with 3D choreography and floating editorial cards.
 */
export const LuxuryBotanicalScroll: React.FC<LuxuryBotanicalScrollProps> = ({ onSelectProduct }) => {
  return <EditorialBottleScroll onSelectProduct={onSelectProduct} />;
};

export default LuxuryBotanicalScroll;
