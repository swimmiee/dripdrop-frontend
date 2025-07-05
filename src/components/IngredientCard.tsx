import { useState } from 'react';
import type { Ingredient } from '../types';

interface IngredientCardProps {
  ingredient: Ingredient;
  onReceive?: (ingredient: Ingredient) => void;
  onClick?: (ingredient: Ingredient) => void;
  size?: 'small' | 'medium' | 'large';
  showReceiveButton?: boolean;
}

function IngredientCard({
  ingredient,
  onReceive,
  onClick,
  size = 'medium',
  showReceiveButton = false
}: IngredientCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24'
  };

  const iconSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };

  const handleReceive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReceive) {
      onReceive(ingredient);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(ingredient);
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-coffee-light border-2 border-coffee-dark rounded relative flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={`${iconSizes[size]}`}>
        {ingredient.icon}
      </div>
      <div className="text-xs text-center mt-1 text-coffee">
        {ingredient.name}
      </div>
      
      {showReceiveButton && isHovered && (
        <button
          onClick={handleReceive}
          className="absolute bottom-2 opacity-100 bg-coffee text-white text-xs px-2 py-1 rounded hover:bg-coffee-dark transition-colors"
        >
          Receive
        </button>
      )}
    </div>
  );
}

export default IngredientCard; 