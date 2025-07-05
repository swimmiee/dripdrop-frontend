import { useState } from "react";
import CraftingGrid from "../components/CraftingGrid";
import ResultPreview from "../components/ResultPreview";
import IngredientCard from "../components/IngredientCard";
import { ingredients } from "../data/ingredients";
import type { Ingredient } from "../types";

// Web3 stub functions
const craftRecipe = (grid: (Ingredient | null)[]) => {
  console.log("Crafting recipe with grid:", grid);
  // TODO: Implement Web3 functionality
};

// Simple recipe logic - this would be more complex in a real app
const getRecipeResult = (grid: (Ingredient | null)[]): Ingredient | null => {
  const nonNullIngredients = grid.filter((item) => item !== null);

  if (nonNullIngredients.length === 0) return null;

  // Simple example: if we have milk + coffee, make coffee drink
  const hasIngredient = (id: string) =>
    nonNullIngredients.some((item) => item?.id === id);

  if (hasIngredient("milk") && hasIngredient("coffee")) {
    return {
      id: "coffee-drink",
      name: "Coffee Drink",
      icon: "☕",
      description: "Delicious coffee with milk",
    };
  }

  if (hasIngredient("ice") && hasIngredient("milk")) {
    return {
      id: "ice-milk",
      name: "Ice Milk",
      icon: "🥛",
      description: "Cold refreshing milk",
    };
  }

  if (hasIngredient("strawberry") && hasIngredient("milk")) {
    return {
      id: "strawberry-milk",
      name: "Strawberry Milk",
      icon: "🍓",
      description: "Sweet strawberry flavored milk",
    };
  }

  return null;
};

function CookPage() {
  const [craftingGrid, setCraftingGrid] = useState<(Ingredient | null)[]>(
    Array(9).fill(null)
  );
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [result, setResult] = useState<Ingredient | null>(null);

  const handleGridChange = (grid: (Ingredient | null)[]) => {
    setCraftingGrid(grid);
    const newResult = getRecipeResult(grid);
    setResult(newResult);
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleCraft = () => {
    if (result) {
      craftRecipe(craftingGrid);
      alert(`Successfully crafted ${result.name}!`);

      // Clear the grid after crafting
      const emptyGrid = Array(9).fill(null);
      setCraftingGrid(emptyGrid);
      setResult(null);
      setSelectedIngredient(null);
    }
  };

  const canCraft = result !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 font-sans">
        <h1 className="text-3xl font-semibold text-coffee text-center mb-8">
          Cook & Craft
        </h1>

        <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
          {/* Crafting Grid */}
          <div className="flex-1 flex justify-center">
            <CraftingGrid
              onGridChange={handleGridChange}
              selectedIngredient={selectedIngredient}
              grid={craftingGrid}
            />
          </div>

          {/* Result Preview */}
          <div className="flex-1 flex justify-center">
            <ResultPreview
              result={result}
              onCraft={handleCraft}
              canCraft={canCraft}
            />
          </div>
        </div>

        {/* Ingredient Palette */}
        <div className="bg-coffee-light p-6 rounded-lg border-2 border-coffee-dark">
          <h2 className="text-xl font-semibold text-coffee mb-4 text-center">
            Ingredient Palette
          </h2>
          {selectedIngredient && (
            <div className="mb-4 text-center">
              <p className="text-sm text-coffee">
                Selected:{" "}
                <span className="font-semibold">{selectedIngredient.name}</span>
              </p>
              <p className="text-xs text-gray-600">
                Click on an empty grid cell to place this ingredient
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className={`flex justify-center ${
                  selectedIngredient?.id === ingredient.id
                    ? "ring-2 ring-coffee rounded-lg"
                    : ""
                }`}
              >
                <IngredientCard
                  ingredient={ingredient}
                  onClick={handleIngredientClick}
                  size="medium"
                  showReceiveButton={false}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Click ingredients to select them, then click on the crafting grid to
            place them
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white p-6 rounded-lg border-2 border-coffee-dark">
          <h3 className="text-lg font-semibold text-coffee mb-3">
            How to Cook:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click on ingredients below to select them</li>
            <li>Click on empty grid cells to place selected ingredients</li>
            <li>Click on filled grid cells to remove ingredients</li>
            <li>Try different combinations to discover new recipes</li>
            <li>Click "Craft" when you see a result appear</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CookPage;
