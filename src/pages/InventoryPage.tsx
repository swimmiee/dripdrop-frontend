import React, { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ingredients } from "../data/ingredients";
import { coffeeMenus } from "../data/coffee";
import { useIngredientToken, useCoffeeNFT } from "../hooks/useContract";
import {
  ingredientTokenUtils,
  coffeeNFTUtils,
} from "../contracts/contractUtils";

const InventoryPage: React.FC = () => {
  const { user, authenticated } = usePrivy();
  const ingredientTokenHook = useIngredientToken();
  const coffeeNFTHook = useCoffeeNFT();

  const [ingredientBalances, setIngredientBalances] = useState<
    Record<number, number>
  >({});
  const [coffeeNFTCounts, setCoffeeNFTCounts] = useState<
    Record<number, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // 재료 잔액 조회
  const fetchIngredientBalances = useCallback(async () => {
    if (!user?.wallet?.address || !ingredientTokenHook.contract) return;

    try {
      const balances: Record<number, number> = {};

      for (const ingredient of ingredients) {
        try {
          const balance = await ingredientTokenUtils.getIngredientBalance(
            ingredientTokenHook.contract,
            user.wallet.address,
            ingredient.id
          );
          balances[ingredient.id] = balance;
        } catch (error) {
          console.error(
            `Failed to fetch balance for ingredient ${ingredient.id}:`,
            error
          );
          balances[ingredient.id] = 0;
        }
      }

      setIngredientBalances(balances);
    } catch (error) {
      console.error("Failed to fetch ingredient balances:", error);
    }
  }, [user?.wallet?.address, ingredientTokenHook.contract]);

  // 커피 NFT 개수 조회
  const fetchCoffeeNFTCounts = useCallback(async () => {
    if (!user?.wallet?.address || !coffeeNFTHook.contract) return;

    try {
      const counts: Record<number, number> = {};

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

      setCoffeeNFTCounts(counts);
    } catch (error) {
      console.error("Failed to fetch coffee NFT counts:", error);
    }
  }, [user?.wallet?.address, coffeeNFTHook.contract]);

  useEffect(() => {
    const fetchData = async () => {
      if (authenticated && user?.wallet?.address) {
        setIsLoading(true);
        await Promise.all([fetchIngredientBalances(), fetchCoffeeNFTCounts()]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    authenticated,
    user,
    ingredientTokenHook.contract,
    coffeeNFTHook.contract,
    fetchIngredientBalances,
    fetchCoffeeNFTCounts,
  ]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            🔒 Connect Your Wallet
          </h1>
          <p className="text-amber-700 mb-6">
            Please connect your wallet to view your inventory
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-amber-800">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">
            📦 Your Inventory
          </h1>
          <p className="text-xl text-amber-700">
            Manage your ingredients and coffee collection
          </p>
        </div>

        {/* 통계 섹션 */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              {Object.values(ingredientBalances).reduce(
                (sum, balance) => sum + balance,
                0
              )}
            </h3>
            <p className="text-green-700">Total Ingredients</p>
          </div>
          <div className="bg-amber-100 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-amber-800 mb-2">
              {Object.values(coffeeNFTCounts).reduce(
                (sum, count) => sum + count,
                0
              )}
            </h3>
            <p className="text-amber-700">Total Coffee NFTs</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              {
                Object.values(ingredientBalances).filter(
                  (balance) => balance > 0
                ).length
              }
            </h3>
            <p className="text-blue-700">Unique Ingredients</p>
          </div>
        </div>

        {/* 재료 섹션 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            🧪 Ingredients
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ingredients.map((ingredient) => {
              const balance = ingredientBalances[ingredient.id] || 0;

              return (
                <div
                  key={ingredient.id}
                  className={`relative bg-white rounded-lg shadow-md p-4 text-center border-2 transition-all ${
                    balance > 0
                      ? "border-green-300 hover:shadow-lg"
                      : "border-gray-200 opacity-60"
                  }`}
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                  <h3 className="text-sm font-medium text-amber-900 mb-1">
                    {ingredient.name}
                  </h3>
                  <p className="text-xs text-amber-600">ID: {ingredient.id}</p>

                  {/* 수량 표시 */}
                  <div
                    className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold ${
                      balance > 0
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-gray-600"
                    }`}
                  >
                    {balance}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 커피 NFT 섹션 */}
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            ☕ Coffee NFTs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coffeeMenus.map((menu) => {
              const nftCount = coffeeNFTCounts[menu.id] || 0;

              return (
                <div
                  key={menu.id}
                  className={`relative bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                    nftCount > 0
                      ? "border-amber-300 hover:shadow-lg"
                      : "border-gray-200 opacity-60"
                  }`}
                >
                  {/* 커피 이미지 */}
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  {/* 메뉴 정보 */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-amber-900 mb-1">
                      {menu.name}
                    </h3>
                    <p className="text-xs text-amber-600 mb-2">
                      Recipe #{menu.id}
                    </p>
                    <p className="text-sm text-amber-700">${menu.price} USDC</p>
                  </div>

                  {/* NFT 개수 표시 */}
                  <div
                    className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold ${
                      nftCount > 0
                        ? "bg-amber-600 text-white"
                        : "bg-gray-400 text-gray-600"
                    }`}
                  >
                    {nftCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
