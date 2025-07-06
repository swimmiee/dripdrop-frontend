export interface Ingredient {
  id: number;
  name: string;
  icon: string;
  description?: string;
  image?: string;
  amount?: number; // 사용자가 보유한 수량
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
