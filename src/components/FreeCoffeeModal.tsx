import React from "react";
import { coffeeMenus } from "../data/coffee";

interface FreeCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: number;
  coffeeName: string;
}

const FreeCoffeeModal: React.FC<FreeCoffeeModalProps> = ({
  isOpen,
  onClose,
  menuId,
  coffeeName,
}) => {
  const [imageError, setImageError] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const coffeeMenu = coffeeMenus.find((menu) => menu.id === menuId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Congratulations!
          </h2>
          <p className="text-green-100">You got a free coffee!</p>
        </div>

        {/* 커피 정보 */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg">
              {coffeeMenu && !imageError ? (
                <img
                  src={coffeeMenu.image}
                  alt={coffeeMenu.name}
                  className="w-24 h-24 object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-6xl">☕</div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-amber-800 mb-2">
              {coffeeName}
            </h3>
            <p className="text-amber-600">
              {coffeeMenu?.description || "Delicious coffee"}
            </p>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔥</span>
              <p className="text-sm text-green-800">
                Your NFT has been burned and you received a free coffee!
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Enjoy Your Coffee!
            </button>
            <button
              onClick={() => {
                onClose();
                // 홈페이지로 이동
                window.location.href = "/";
              }}
              className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCoffeeModal;
