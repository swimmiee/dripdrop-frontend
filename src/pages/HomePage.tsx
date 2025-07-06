import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { coffeeMenus } from "../data/coffee";
import { useCoffeeNFT } from "../hooks/useContract";
import { coffeeNFTUtils } from "../contracts/contractUtils";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();

  const coffeeNFTHook = useCoffeeNFT();

  // 각 메뉴별 NFT 개수
  const [menuNFTCounts, setMenuNFTCounts] = useState<Record<number, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  // 메뉴별 NFT 개수 조회
  const fetchMenuNFTCounts = async () => {
    if (!user?.wallet?.address || !coffeeNFTHook.contract) return;

    try {
      const counts: Record<number, number> = {};

      // 모든 메뉴에 대해 NFT 개수 조회
      for (const menu of coffeeMenus) {
        try {
          const count = await coffeeNFTUtils.getMenuNFTCount(
            coffeeNFTHook.contract,
            user.wallet.address,
            menu.id
          );
          counts[menu.id] = count;
        } catch (error) {
          console.error(
            `Failed to fetch NFT count for menu ${menu.id}:`,
            error
          );
          counts[menu.id] = 0;
        }
      }

      setMenuNFTCounts(counts);
    } catch (error) {
      console.error("Failed to fetch menu NFT counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuNFTCounts();
  }, [user, coffeeNFTHook.contract]);

  // 메뉴 클릭 시 상세 페이지로 이동
  const handleMenuClick = (menuId: number) => {
    navigate(`/menu/${menuId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-amber-800">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">
            ☕ DripDrop Cafe
          </h1>
          <p className="text-xl text-amber-700">
            Craft your perfect coffee with blockchain ingredients
          </p>
        </div>

        {/* 커피 메뉴 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coffeeMenus.map((menu) => {
            const nftCount = menuNFTCounts[menu.id] || 0;

            return (
              <div
                key={menu.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 duration-200"
                onClick={() => handleMenuClick(menu.id)}
              >
                {/* 커피 이미지 */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-24 h-24 object-contain"
                    onLoad={() =>
                      console.log("HomePage image loaded:", menu.image)
                    }
                    onError={(e) => {
                      console.error(
                        "HomePage image failed to load:",
                        menu.image
                      );
                      console.error("Error:", e);
                    }}
                  />

                  {/* NFT 개수 표시 (마인크래프트 스타일) */}
                  {nftCount > 0 && (
                    <div className="absolute bottom-2 right-2 bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                      {nftCount}
                    </div>
                  )}
                </div>

                {/* 메뉴 정보 */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    {menu.name}
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    {menu.description}
                  </p>

                  {/* 가격 정보 */}
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-600">
                      ${menu.price} USDC
                    </div>
                    <div className="text-xs text-amber-500">
                      Recipe #{menu.id}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/cook")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Start Crafting ⚡
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
