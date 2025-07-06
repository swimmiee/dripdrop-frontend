import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ingredients } from "../data/ingredients";
import { coffeeMenus } from "../data/coffee";
import {
  dripDropCafeUtils,
  ingredientTokenUtils,
} from "../contracts/contractUtils";
import { useDripDropCafe, useIngredientToken } from "../hooks/useContract";
import SuccessModal from "../components/SuccessModal";
import CraftingLoader from "../components/CraftingLoader";

const CookPage: React.FC = () => {
  const { user } = usePrivy();
  const dripDropCafeHook = useDripDropCafe(true);
  const ingredientTokenHook = useIngredientToken();

  // 사용자 보유 재료 (실제 잔액)
  const [userIngredients, setUserIngredients] = useState<{
    [key: number]: number;
  }>({});
  // 크래프트 박스 상태 (9칸 배열)
  const [craftBox, setCraftBox] = useState<number[]>(Array(9).fill(0));
  // 현재 표시되는 재료 (보유량 - 사용량)
  const [displayIngredients, setDisplayIngredients] = useState<{
    [key: number]: number;
  }>({});
  // 매칭된 메뉴
  const [matchedMenu, setMatchedMenu] = useState<number>(0);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  const [crafting, setCrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 성공 모달 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMenuId, setSuccessMenuId] = useState<number>(0);
  const [successCoffeeName, setSuccessCoffeeName] = useState<string>("");
  const [successTokenId, setSuccessTokenId] = useState<number | undefined>(
    undefined
  );
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined
  );

  // 사용자 보유 재료 조회
  const fetchUserIngredients = async () => {
    if (!user?.wallet?.address || !ingredientTokenHook.contract) return;

    try {
      const balances: { [key: number]: number } = {};

      // 모든 재료 ID에 대해 잔액 조회
      for (const ingredient of ingredients) {
        const balance = await ingredientTokenUtils.getIngredientBalance(
          ingredientTokenHook.contract,
          user.wallet.address,
          ingredient.id
        );
        balances[ingredient.id] = balance;
      }

      setUserIngredients(balances);
      setDisplayIngredients(balances);
      setLoading(false);
    } catch (error) {
      console.error("재료 조회 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIngredients();
  }, [user, ingredientTokenHook.contract]);

  // 크래프트 박스 변경 시 레시피 확인
  useEffect(() => {
    const checkRecipe = async () => {
      if (!dripDropCafeHook.contract) {
        console.log("Contract not available");
        return;
      }

      console.log("Checking recipe for craftBox:", craftBox);

      try {
        const menuId = await dripDropCafeUtils.findMatchingRecipe(
          dripDropCafeHook.contract,
          craftBox
        );
        console.log("Found matching menu ID:", menuId);
        setMatchedMenu(menuId);
      } catch (error) {
        console.error("Recipe check failed:", error);
        setMatchedMenu(0);
      }
    };

    checkRecipe();
  }, [craftBox, dripDropCafeHook.contract]);

  // 크래프트 박스 변경 시 표시 재료 업데이트
  useEffect(() => {
    const updatedDisplay = { ...userIngredients };

    // 크래프트 박스에 사용된 재료 개수 계산
    const usedIngredients: { [key: number]: number } = {};
    craftBox.forEach((ingredientId) => {
      if (ingredientId > 0) {
        usedIngredients[ingredientId] =
          (usedIngredients[ingredientId] || 0) + 1;
      }
    });

    // 표시 재료 = 보유 재료 - 사용된 재료
    for (const ingredientId in usedIngredients) {
      const id = Number(ingredientId);
      updatedDisplay[id] =
        (userIngredients[id] || 0) - (usedIngredients[id] || 0);
    }

    setDisplayIngredients(updatedDisplay);
  }, [craftBox, userIngredients]);

  // 재료를 크래프트 박스에 놓기
  const handleIngredientClick = (ingredientId: number) => {
    // 보유 재료가 0개면 놓을 수 없음
    if ((displayIngredients[ingredientId] || 0) <= 0) return;

    // 빈 칸 찾기
    const emptyIndex = craftBox.findIndex((slot) => slot === 0);
    if (emptyIndex === -1) return; // 빈 칸이 없으면 return

    // 크래프트 박스에 재료 놓기
    const newCraftBox = [...craftBox];
    newCraftBox[emptyIndex] = ingredientId;
    setCraftBox(newCraftBox);
  };

  // 크래프트 박스에서 재료 빼기
  const handleCraftBoxClick = (index: number) => {
    const ingredientId = craftBox[index];
    if (ingredientId === 0) return; // 빈 칸이면 return

    // 크래프트 박스에서 재료 제거
    const newCraftBox = [...craftBox];
    newCraftBox[index] = 0;
    setCraftBox(newCraftBox);
  };

  // 크래프트 박스 초기화
  const clearCraftBox = () => {
    setCraftBox(Array(9).fill(0));
  };

  // 커피 제작
  const handleCraftCoffee = async () => {
    if (
      !dripDropCafeHook.contract ||
      !user?.wallet?.address ||
      matchedMenu === 0
    )
      return;

    try {
      setCrafting(true);
      setError(null);

      console.log("커피 제작 시작:", {
        menuId: matchedMenu,
        pattern: craftBox,
      });

      // 컨트랙트 호출 - menuId와 9칸 패턴 배열 전달
      const result = await dripDropCafeUtils.craftCoffee(
        dripDropCafeHook.contract,
        matchedMenu,
        craftBox
      );

      console.log("커피 제작 완료:", result);

      // 트랜잭션 해시 저장
      const txHash = result.hash;
      console.log("Transaction hash:", txHash);

      // 트랜잭션 로그에서 토큰 ID 추출
      let extractedTokenId: number | undefined = undefined;
      try {
        console.log("Transaction result:", result);
        console.log("Transaction logs:", result.logs);

        if (result.logs && result.logs.length > 0) {
          // Transfer 이벤트에서 토큰 ID 찾기
          for (const log of result.logs) {
            console.log("Processing log:", log);
            if (log.topics && log.topics.length >= 4) {
              // Transfer 이벤트: Transfer(address from, address to, uint256 tokenId)
              const tokenIdHex = log.topics[3];
              console.log("Token ID hex:", tokenIdHex);
              if (tokenIdHex) {
                extractedTokenId = parseInt(tokenIdHex, 16);
                console.log("Extracted token ID:", extractedTokenId);
                break;
              }
            }
          }
        }

        // 만약 토큰 ID를 찾지 못했다면 임시로 랜덤 ID 생성 (테스트용)
        if (!extractedTokenId) {
          extractedTokenId = Math.floor(Math.random() * 10000) + 1;
          console.log("Generated temporary token ID:", extractedTokenId);
        }
      } catch (error) {
        console.warn("토큰 ID 추출 실패:", error);
        // 에러 발생 시에도 임시 토큰 ID 생성
        extractedTokenId = Math.floor(Math.random() * 10000) + 1;
        console.log("Generated fallback token ID:", extractedTokenId);
      }

      // 2초 지연 후 성공 모달 표시
      setTimeout(() => {
        const coffeeName =
          coffeeMenus.find((menu) => menu.id === matchedMenu)?.name ||
          "Unknown Coffee";
        setSuccessMenuId(matchedMenu);
        setSuccessCoffeeName(coffeeName);
        setSuccessTokenId(extractedTokenId);
        setSuccessTxHash(txHash);
        setShowSuccessModal(true);
        setCrafting(false);
      }, 2000);

      // 크래프트 박스 초기화
      clearCraftBox();

      // 재료 재조회 (사용된 재료 반영)
      await fetchUserIngredients();
    } catch (error: unknown) {
      console.error("커피 제작 실패:", error);

      // 에러 메시지 처리
      let errorMessage = "Coffee crafting failed.";

      if (error instanceof Error && error.message?.includes("insufficient")) {
        errorMessage = "Insufficient ingredients.";
      } else if (
        error instanceof Error &&
        error.message?.includes("rejected")
      ) {
        errorMessage = "Transaction was rejected.";
      } else if (
        error instanceof Error &&
        error.message?.includes("Invalid recipe")
      ) {
        errorMessage = "Invalid recipe.";
      } else if (
        error instanceof Error &&
        error.message?.includes("Pattern must be exactly 9 elements")
      ) {
        errorMessage = "Pattern must be exactly 9 elements.";
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setCrafting(false);
    }
  };

  // 성공 모달 닫기
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMenuId(0);
    setSuccessCoffeeName("");
    setSuccessTokenId(undefined);
    setSuccessTxHash(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-amber-800">Loading ingredients...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">
          ☕ Coffee Crafting
        </h1>

        {/* 에러 메시지만 표시 (성공 메시지는 모달로 대체) */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 보유 재료 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                Your Ingredients
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {ingredients.map((ingredient) => {
                  const count = displayIngredients[ingredient.id] || 0;
                  const isAvailable = count > 0;

                  return (
                    <div
                      key={ingredient.id}
                      className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isAvailable
                          ? "border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-100"
                          : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => handleIngredientClick(ingredient.id)}
                    >
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-16 h-16 mx-auto mb-2 object-contain"
                      />
                      <p className="text-sm font-medium text-center text-amber-800">
                        {ingredient.name}
                      </p>
                      {count > 0 && (
                        <div className="absolute top-1 right-1 bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 크래프트 박스 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                Craft Box
              </h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {craftBox.map((ingredientId, index) => {
                  const ingredient = ingredients.find(
                    (ing) => ing.id === ingredientId
                  );

                  return (
                    <div
                      key={index}
                      className="aspect-square border-2 border-amber-300 rounded-lg bg-amber-50 flex items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors"
                      onClick={() => handleCraftBoxClick(index)}
                    >
                      {ingredient?.image && ingredient.name && (
                        <img
                          src={ingredient.image}
                          alt={ingredient.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCraftBox}
                  disabled={crafting}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleCraftCoffee}
                  disabled={matchedMenu === 0 || crafting}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    matchedMenu > 0 && !crafting
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {crafting ? "Crafting..." : "Craft Coffee"}
                </button>
              </div>
            </div>
          </div>

          {/* 결과 미리보기 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Result</h2>
              {matchedMenu > 0 ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-amber-100 rounded-lg flex items-center justify-center">
                    {(() => {
                      const matchedCoffee = coffeeMenus.find(
                        (menu) => menu.id === matchedMenu
                      );
                      return matchedCoffee ? (
                        <img
                          src={matchedCoffee.image}
                          alt={matchedCoffee.name}
                          className="w-28 h-28 object-contain"
                          onLoad={() =>
                            console.log("Image loaded:", matchedCoffee.image)
                          }
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              matchedCoffee.image
                            );
                            console.error("Error:", e);
                          }}
                        />
                      ) : (
                        <div className="text-4xl">☕</div>
                      );
                    })()}
                  </div>
                  <h3 className="text-lg font-bold text-amber-800 mb-2">
                    {coffeeMenus.find((menu) => menu.id === matchedMenu)
                      ?.name || "Unknown Coffee"}
                  </h3>
                  <p className="text-sm text-amber-600">
                    {coffeeMenus.find((menu) => menu.id === matchedMenu)
                      ?.description || ""}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">❓</span>
                  </div>
                  <p>Place ingredients to see recipe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        menuId={successMenuId}
        coffeeName={successCoffeeName}
        tokenId={successTokenId}
        txHash={successTxHash}
      />

      {/* 제작 중 로딩 */}
      <CraftingLoader
        isVisible={crafting}
        coffeeName={
          coffeeMenus.find((menu) => menu.id === matchedMenu)?.name || "Coffee"
        }
      />
    </div>
  );
};

export default CookPage;
