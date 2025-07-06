import React from "react";
import { coffeeMenus } from "../data/coffee";
import { getContractAddress } from "../contracts/contractConfig";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: number;
  coffeeName: string;
  tokenId?: number; // 새로 민팅된 NFT 토큰 ID
  txHash?: string; // 트랜잭션 해시
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  menuId,
  coffeeName,
  tokenId,
  txHash,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const coffeeMenu = coffeeMenus.find((menu) => menu.id === menuId);

  // 디버깅 로그
  console.log("SuccessModal props:", {
    isOpen,
    menuId,
    coffeeName,
    tokenId,
    txHash,
  });

  // 월드체인 세폴리아 테스트넷 익스플로러 링크 생성 (트랜잭션 해시 사용)
  const getExplorerLink = () => {
    if (!txHash) {
      console.log("No txHash provided, explorer link disabled");
      return null;
    }

    const link = `https://sepolia.worldscan.org/tx/${txHash}`;
    console.log("Generated explorer link:", link);
    return link;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-bounce-in">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-amber-700">
            Your coffee NFT has been successfully minted!
          </p>
        </div>

        {/* NFT 이미지 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-48 h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg border-4 border-amber-300">
              {coffeeMenu?.image ? (
                <img
                  src={coffeeMenu.image}
                  alt={coffeeName}
                  className="w-44 h-44 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-6xl">☕</div>
              )}
            </div>
            {/* 반짝이는 효과 */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-400 rounded-full animate-ping opacity-75 animation-delay-150"></div>
          </div>
        </div>

        {/* 커피 정보 */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-2">
            {coffeeName}
          </h3>
          <p className="text-sm text-amber-600">
            {coffeeMenu?.description || "Delicious coffee NFT!"}
          </p>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              🏆 This NFT has been saved to your wallet
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              const explorerLink = getExplorerLink();
              if (explorerLink) {
                window.open(explorerLink, "_blank");
              }
            }}
            disabled={!txHash}
            className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
              txHash
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            View in Explorer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
