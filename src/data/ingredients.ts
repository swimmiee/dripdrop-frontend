import type { Ingredient } from '../types';

export const ingredients: Ingredient[] = [
  {
    id: 'caramel',
    name: 'Caramel',
    icon: '🍮',
    description: 'Sweet caramel ingredient'
  },
  {
    id: 'sugar',
    name: 'Sugar',
    icon: '🧂',
    description: 'White sugar crystals'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    icon: '🍓',
    description: 'Fresh strawberry'
  },
  {
    id: 'mint',
    name: 'Mint Leaves',
    icon: '🌿',
    description: 'Fresh mint leaves'
  },
  {
    id: 'water',
    name: 'Water',
    icon: '💧',
    description: 'Pure water'
  },
  {
    id: 'milk',
    name: 'Milk',
    icon: '🥛',
    description: 'Fresh milk'
  },
  {
    id: 'ice',
    name: 'Ice',
    icon: '🧊',
    description: 'Ice cubes'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
    description: 'Coffee beans'
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    icon: '🍫',
    description: 'Dark chocolate'
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    icon: '🌾',
    description: 'Vanilla extract'
  },
  {
    id: 'whipped-cream',
    name: 'Whipped Cream',
    icon: '🍦',
    description: 'Fluffy whipped cream'
  },
  {
    id: 'icecream',
    name: 'Ice Cream',
    icon: '🍨',
    description: 'Vanilla ice cream'
  }
];

export const getIngredientById = (id: string): Ingredient | undefined => {
  return ingredients.find(ingredient => ingredient.id === id);
}; 