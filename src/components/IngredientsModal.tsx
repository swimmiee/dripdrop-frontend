import React from "react";
import { ingredients } from "../data/ingredients";

interface IngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  acquiredIngredients: { id: number; amount: number }[]; // 획득한 재료들
}

const IngredientsModal: React.FC<IngredientsModalProps> = ({
  isOpen,
  onClose,
  acquiredIngredients,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 overflow-hidden animate-bounce-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Congratulations!
          </h2>
          <p className="text-green-100">You received random ingredients!</p>
        </div>

        {/* 획득한 재료들 */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Acquired Ingredients
          </h3>

          <div className="flex justify-center mb-6">
            {acquiredIngredients.map((acquired) => {
              const ingredient = ingredients.find(
                (ing) => ing.id === acquired.id
              );
              if (!ingredient) return null;

              return (
                <div
                  key={acquired.id}
                  className="relative bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center w-32"
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                  <p className="text-sm font-medium text-amber-800">
                    {ingredient.name}
                  </p>
                  {/* 수량 표시 */}
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    +{acquired.amount}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 안내 메시지 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-3">🏆</span>
              <p className="text-sm text-yellow-800 text-center">
                These ingredients have been added to your inventory!
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Awesome!
            </button>
            <button
              onClick={() => {
                onClose();
                // Cook 페이지로 이동
                window.location.href = "/cook";
              }}
              className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go Cook!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsModal;
