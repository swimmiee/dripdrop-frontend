import { useState, useEffect } from "react";
import type { Ingredient } from "../types";

interface CraftingGridProps {
  onGridChange?: (grid: (Ingredient | null)[]) => void;
  selectedIngredient?: Ingredient | null;
  grid?: (Ingredient | null)[];
}

function CraftingGrid({
  onGridChange,
  selectedIngredient,
  grid: externalGrid,
}: CraftingGridProps) {
  const [grid, setGrid] = useState<(Ingredient | null)[]>(
    externalGrid || Array(9).fill(null)
  );

  useEffect(() => {
    if (externalGrid) {
      setGrid(externalGrid);
    }
  }, [externalGrid]);

  const handleCellClick = (index: number) => {
    const newGrid = [...grid];

    if (newGrid[index] !== null) {
      // Clear the cell if it has an ingredient
      newGrid[index] = null;
    } else if (selectedIngredient) {
      // Place the selected ingredient if cell is empty
      newGrid[index] = selectedIngredient;
    }

    setGrid(newGrid);

    if (onGridChange) {
      onGridChange(newGrid);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const ingredientData = e.dataTransfer.getData("application/json");

    if (ingredientData) {
      const ingredient = JSON.parse(ingredientData);
      const newGrid = [...grid];
      newGrid[index] = ingredient;
      setGrid(newGrid);

      if (onGridChange) {
        onGridChange(newGrid);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-coffee mb-4">Crafting Grid</h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-2 bg-coffee-light p-4 border-4 border-coffee-dark rounded-lg">
        {grid.map((ingredient, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-white border-2 border-coffee-dark rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleCellClick(index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {ingredient ? (
              ingredient.image ? (
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="text-2xl">{ingredient.icon}</div>
              )
            ) : (
              <div className="text-gray-400 text-xs">+</div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        Click ingredients below to place them, or click cells to clear
      </p>
    </div>
  );
}

export default CraftingGrid;
