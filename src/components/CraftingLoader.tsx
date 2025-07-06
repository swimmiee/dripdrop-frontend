import React from "react";

interface CraftingLoaderProps {
  isVisible: boolean;
  coffeeName?: string;
}

const CraftingLoader: React.FC<CraftingLoaderProps> = ({
  isVisible,
  coffeeName = "Coffee",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        {/* 커피 제작 애니메이션 */}
        <div className="mb-6 flex justify-center items-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* 커피 컵 */}
            <div className="text-6xl animate-bounce">☕</div>
            {/* 증기 애니메이션 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-1 h-6 bg-gray-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="w-1 h-8 bg-gray-400 rounded-full opacity-40 animate-pulse animation-delay-100"></div>
                <div className="w-1 h-6 bg-gray-400 rounded-full opacity-60 animate-pulse animation-delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Crafting {coffeeName}...
        </h3>
        <p className="text-gray-600 mb-4">
          Please wait while we prepare your coffee
        </p>

        {/* 로딩 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-amber-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>

        {/* 재료 아이콘들 */}
        <div className="mt-6 flex justify-center space-x-2">
          <span className="text-2xl animate-spin">🫘</span>
          <span className="text-2xl animate-bounce animation-delay-100">
            💧
          </span>
          <span className="text-2xl animate-pulse animation-delay-200">🥛</span>
        </div>
      </div>
    </div>
  );
};

export default CraftingLoader;
