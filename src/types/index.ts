export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  result: string;
  pattern: (string | null)[][];
}

export interface CraftingCell {
  ingredient: Ingredient | null;
  position: number;
} 