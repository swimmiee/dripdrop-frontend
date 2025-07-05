import { useState } from "react";
import IngredientCard from "../components/IngredientCard";
import { ingredients } from "../data/ingredients";
import type { Ingredient } from "../types";

// Web3 stub functions
const receiveIngredient = (ingredient: Ingredient) => {
  console.log("Receiving ingredient:", ingredient);
  // TODO: Implement Web3 functionality
};

function HomePage() {
  const [receivedIngredients, setReceivedIngredients] = useState<Ingredient[]>(
    []
  );

  const handleReceive = (ingredient: Ingredient) => {
    receiveIngredient(ingredient);
    setReceivedIngredients((prev) => [...prev, ingredient]);

    // Show success message
    alert(`${ingredient.name} received!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 font-sans">
        <h1 className="text-3xl font-semibold text-coffee text-center mb-8">
          Receive Ingredients
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex flex-col items-center">
              <IngredientCard
                ingredient={ingredient}
                onReceive={handleReceive}
                size="large"
                showReceiveButton={true}
              />
            </div>
          ))}
        </div>

        {receivedIngredients.length > 0 && (
          <div className="mt-8 p-4 bg-coffee-light rounded-lg border-2 border-coffee-dark">
            <h2 className="text-xl font-semibold text-coffee mb-4">
              Received Ingredients ({receivedIngredients.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {receivedIngredients.map((ingredient, index) => (
                <div
                  key={`${ingredient.id}-${index}`}
                  className="flex flex-col items-center"
                >
                  <IngredientCard
                    ingredient={ingredient}
                    size="medium"
                    showReceiveButton={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
