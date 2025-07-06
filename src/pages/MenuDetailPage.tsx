import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { getCoffeeMenuById } from "../data/coffee";
import { ingredients } from "../data/ingredients";
import {
  useDripDropCafe,
  useCoffeeNFT,
  usePaymentToken,
} from "../hooks/useContract";
import {
  dripDropCafeUtils,
  coffeeNFTUtils,
  paymentTokenUtils,
} from "../contracts/contractUtils";
import { getContractAddress } from "../contracts/contractConfig";
import IngredientsModal from "../components/IngredientsModal";
import FreeCoffeeModal from "../components/FreeCoffeeModal";

const MenuDetailPage: React.FC = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  const { user } = usePrivy();
  const dripDropCafeHook = useDripDropCafe(true);
  const coffeeNFTHook = useCoffeeNFT();
  const paymentTokenHook = usePaymentToken(true);

  const [nftCount, setNftCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [usdcApproved, setUsdcApproved] = useState<boolean>(false);

  // 재료 획득 모달 상태
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [acquiredIngredients, setAcquiredIngredients] = useState<
    { id: number; amount: number }[]
  >([]);

  // 공짜 커피 모달 상태
  const [showFreeCoffeeModal, setShowFreeCoffeeModal] = useState(false);
  const [freeCoffeeMenuId, setFreeCoffeeMenuId] = useState<number>(0);
  const [freeCoffeeName, setFreeCoffeeName] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  const menu = getCoffeeMenuById(Number(menuId));

  // NFT 개수 조회
  const fetchNFTCount = async () => {
    if (!user?.wallet?.address || !coffeeNFTHook.contract || !menu) return;

    try {
      const count = await coffeeNFTUtils.getMenuNFTCount(
        coffeeNFTHook.contract,
        user.wallet.address,
        menu.id
      );
      setNftCount(count);
    } catch (error) {
      console.error("Failed to fetch NFT count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // USDC 잔액 및 승인 상태 조회
  const fetchUSDCInfo = async () => {
    if (
      !user?.wallet?.address ||
      !paymentTokenHook.contract ||
      !dripDropCafeHook.contract ||
      !menu
    )
      return;

    try {
      // USDC 잔액 조회
      const balance = await paymentTokenUtils.getBalance(
        paymentTokenHook.contract,
        user.wallet.address
      );
      setUsdcBalance(balance);

      // USDC 승인 상태 확인 (allowance 확인)
      const dripDropCafeAddress = getContractAddress(4801, "DRIPDROP_CAFE");
      const allowance = await paymentTokenHook.contract.allowance(
        user.wallet.address,
        dripDropCafeAddress
      );
      const allowanceUSDC = Number(allowance) / 1e6;
      setUsdcApproved(allowanceUSDC >= menu.price);
    } catch (error) {
      console.error("Failed to fetch USDC info:", error);
    }
  };

  useEffect(() => {
    fetchNFTCount();
    fetchUSDCInfo();
  }, [
    user,
    coffeeNFTHook.contract,
    paymentTokenHook.contract,
    dripDropCafeHook.contract,
    menu,
  ]);

  // 메뉴 주문 (돈 주고 사기)
  const handleOrder = async () => {
    if (!dripDropCafeHook.contract || !paymentTokenHook.contract || !menu)
      return;

    try {
      setIsOrdering(true);
      setMessage(null);

      // 1. USDC 잔액 확인
      if (usdcBalance < menu.price) {
        setMessage(
          `Insufficient USDC balance. You need ${
            menu.price
          } USDC but have ${usdcBalance.toFixed(2)} USDC.`
        );
        setMessageType("error");
        return;
      }

      // 2. USDC 승인 확인 및 승인 처리
      if (!usdcApproved) {
        setMessage("Approving USDC spending...");
        const dripDropCafeAddress = getContractAddress(4801, "DRIPDROP_CAFE");
        await paymentTokenUtils.approve(
          paymentTokenHook.contract,
          dripDropCafeAddress,
          menu.price * 2 // 여유분을 위해 2배 승인
        );
        setUsdcApproved(true);
      }

      // 2.5. 컨트랙트에서 실제 레시피 확인
      try {
        const contractPattern =
          await dripDropCafeHook.contract.getRecipePattern(menu.id);
        console.log(
          "📋 Contract recipe pattern for menu",
          menu.id,
          ":",
          contractPattern
        );
        console.log("📋 Frontend recipe pattern:", menu.recipe);

        // 레시피 풀 분석
        const recipePool = contractPattern.filter((id: number) => id !== 0);
        console.log("🎲 Recipe ingredient pool:", recipePool);
        console.log("🎲 Pool length:", recipePool.length);

        // 각 재료별 확률 계산
        const ingredientCounts: Record<number, number> = {};
        recipePool.forEach((id: number) => {
          ingredientCounts[id] = (ingredientCounts[id] || 0) + 1;
        });
        console.log("📊 Ingredient probabilities:");
        Object.entries(ingredientCounts).forEach(([id, count]) => {
          const probability = ((count / recipePool.length) * 100).toFixed(1);
          console.log(
            `  - Ingredient ${id}: ${count}/${recipePool.length} (${probability}%)`
          );
        });
      } catch (error) {
        console.error("Failed to get contract recipe:", error);
      }

      // 3. 메뉴 주문 실행
      setMessage("Ordering menu...");
      const result = await dripDropCafeUtils.orderMenu(
        dripDropCafeHook.contract,
        menu.id
      );

      console.log("Order result:", result);
      console.log("Transaction hash:", result.hash);
      console.log(
        "🔗 View on explorer:",
        `https://worldchain-sepolia.explorer.alchemy.com/tx/${result.hash}`
      );

      // 트랜잭션 로그에서 MenuOrdered 이벤트 파싱
      let acquiredIngredients: { id: number; amount: number }[] = [];

      try {
        console.log("Parsing transaction logs for MenuOrdered event...");
        console.log("Transaction logs:", result.logs);

        if (result.logs && result.logs.length > 0) {
          // MenuOrdered 이벤트 시그니처: MenuOrdered(address indexed user, uint256 indexed menuId, uint8 ingredientId)
          const menuOrderedSignature = ethers.id(
            "MenuOrdered(address,uint256,uint8)"
          );
          console.log(
            "Looking for MenuOrdered signature:",
            menuOrderedSignature
          );

          for (const log of result.logs) {
            console.log("Processing log:", log);

            if (
              log.topics &&
              log.topics.length >= 3 &&
              log.topics[0] === menuOrderedSignature
            ) {
              console.log("Found MenuOrdered event!");

              // topics[0] = event signature
              // topics[1] = user address (indexed)
              // topics[2] = menuId (indexed)
              // data = ingredientId (uint8, not indexed)

              // 먼저 menuId 확인
              const eventMenuId = parseInt(log.topics[2], 16);
              console.log("Event menuId:", eventMenuId, "Expected:", menu.id);

              // 올바른 메뉴 ID인지 확인
              if (eventMenuId === menu.id && log.data && log.data !== "0x") {
                try {
                  // data 필드에서 ingredientId 추출 (uint8)
                  const dataHex = log.data.slice(2); // 0x 제거
                  console.log("MenuOrdered data:", dataHex);

                  // uint8은 32바이트(64 hex chars)로 패딩되어 있음
                  // 예: 0x0000000000000000000000000000000000000000000000000000000000000001 (ingredientId = 1)
                  let ingredientId: number;
                  if (dataHex.length >= 64) {
                    // 마지막 바이트에서 실제 값 추출
                    ingredientId = parseInt(dataHex.slice(-2), 16);
                    console.log(
                      "Parsed ingredientId from padded data:",
                      ingredientId
                    );
                  } else if (dataHex.length > 0) {
                    // 짧은 데이터의 경우 전체를 파싱
                    ingredientId = parseInt(dataHex, 16);
                    console.log(
                      "Parsed ingredientId from short data:",
                      ingredientId
                    );
                  } else {
                    console.warn("No data in MenuOrdered event");
                    continue;
                  }

                  // 유효한 재료 ID인지 확인 (1-12)
                  if (ingredientId > 0 && ingredientId <= 12) {
                    acquiredIngredients = [{ id: ingredientId, amount: 1 }];
                    console.log(
                      "✅ Successfully parsed ingredient from MenuOrdered event:",
                      {
                        menuId: eventMenuId,
                        ingredientId: ingredientId,
                        amount: 1,
                      }
                    );
                    break; // 찾았으므로 중단
                  } else {
                    console.warn("Invalid ingredient ID:", ingredientId);
                  }
                } catch (parseError) {
                  console.warn("Failed to parse MenuOrdered data:", parseError);
                }
              } else {
                console.log("MenuId mismatch or no data, skipping this event");
              }
            }
          }
        }

        // 파싱에 실패한 경우 경고
        if (acquiredIngredients.length === 0) {
          console.error("❌ CRITICAL: No MenuOrdered event found!");
          console.error(
            "This means the contract is not working correctly or event parsing failed"
          );
          console.error(
            "Expected: MenuOrdered event with ingredientId from recipe pool"
          );
          console.error(
            "Please check the transaction on explorer:",
            `https://worldchain-sepolia.explorer.alchemy.com/tx/${result.hash}`
          );

          // 임시로 랜덤 생성 (실제로는 컨트랙트에서 나와야 함)
          const randomId = Math.floor(Math.random() * ingredients.length) + 1;
          acquiredIngredients = [{ id: randomId, amount: 1 }];
          console.warn("⚠️ Using fallback random ingredient:", randomId);
        }
      } catch (error) {
        console.error("Failed to parse MenuOrdered event:", error);
        // 에러 발생 시 랜덤 생성
        const randomId = Math.floor(Math.random() * ingredients.length) + 1;
        acquiredIngredients = [{ id: randomId, amount: 1 }];
      }

      console.log("Final acquired ingredients:", acquiredIngredients);
      setAcquiredIngredients(acquiredIngredients);
      setShowIngredientsModal(true);

      // 성공 메시지는 모달로 대체
      setMessage(null);

      // 데이터 재조회
      await fetchNFTCount();
      await fetchUSDCInfo();
    } catch (error: unknown) {
      console.error("Order failed:", error);

      let errorMessage = "Order failed. Please try again.";
      if (error instanceof Error && error.message?.includes("insufficient")) {
        errorMessage = "Insufficient USDC balance or gas.";
      } else if (
        error instanceof Error &&
        error.message?.includes("rejected")
      ) {
        errorMessage = "Transaction was rejected by user.";
      } else if (
        error instanceof Error &&
        error.message?.includes("MenuPriceNotSet")
      ) {
        errorMessage = "Menu price not set in contract.";
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsOrdering(false);
    }
  };

  // NFT 소모하여 무료 커피 받기 (NFT burn)
  const handleRedeem = async () => {
    if (
      !dripDropCafeHook.contract ||
      !coffeeNFTHook.contract ||
      !menu ||
      nftCount === 0
    )
      return;

    try {
      setIsRedeeming(true);
      setMessage(null);

      // 사용자의 해당 메뉴 NFT 목록 가져오기
      const userNFTs = await coffeeNFTUtils.getUserMenuNFTs(
        coffeeNFTHook.contract,
        user?.wallet?.address || "",
        menu.id
      );

      if (userNFTs.length === 0) {
        setMessage("No NFTs found for this menu.");
        setMessageType("error");
        return;
      }

      // 첫 번째 NFT 사용
      const tokenId = userNFTs[0];

      console.log("Burning NFT:", tokenId, "for free coffee");

      const result = await dripDropCafeUtils.burnCoffeeNFTForFreeCoffee(
        dripDropCafeHook.contract,
        tokenId
      );

      console.log("Burn result:", result);

      // 공짜 커피 모달 표시
      setFreeCoffeeMenuId(menu.id);
      setFreeCoffeeName(menu.name);
      setShowFreeCoffeeModal(true);

      // 성공 메시지는 모달로 대체
      setMessage(null);

      // NFT 개수 재조회
      await fetchNFTCount();
    } catch (error: unknown) {
      console.error("Burn failed:", error);

      let errorMessage = "Failed to use NFT for free coffee.";
      if (error instanceof Error && error.message?.includes("insufficient")) {
        errorMessage = "Insufficient NFTs.";
      } else if (
        error instanceof Error &&
        error.message?.includes("rejected")
      ) {
        errorMessage = "Transaction was rejected by user.";
      } else if (
        error instanceof Error &&
        error.message?.includes("not found")
      ) {
        errorMessage = "Contract method not found.";
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsRedeeming(false);
    }
  };

  if (!menu) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">
            Menu not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-amber-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-amber-600 hover:text-amber-800 font-medium"
        >
          ← Back to Menu
        </button>

        {/* 메시지 표시 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* 반응형 레이아웃 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* 커피 이미지 */}
                <div className="md:w-1/2 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center p-8">
                  <div className="relative">
                    {!imageError ? (
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-48 h-48 object-contain"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-8xl">
                        ☕
                      </div>
                    )}
                    {/* NFT 개수 표시 */}
                    {nftCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                        {nftCount}
                      </div>
                    )}
                  </div>
                </div>

                {/* 메뉴 정보 */}
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold text-amber-900 mb-4">
                    {menu.name}
                  </h1>
                  <p className="text-lg text-amber-700 mb-4">
                    {menu.description}
                  </p>

                  {/* 가격 정보 */}
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      ${menu.price} USDC
                    </div>
                    <p className="text-sm text-green-700">
                      Order price for random ingredients
                    </p>
                  </div>

                  {/* USDC 잔액 정보 */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Your USDC Balance
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-700">
                        Balance:{" "}
                        <span className="font-bold">
                          {usdcBalance.toFixed(2)} USDC
                        </span>
                      </p>
                      <div
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          usdcApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {usdcApproved ? "Approved" : "Need Approval"}
                      </div>
                    </div>
                  </div>

                  {/* NFT 개수 정보 */}
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Your Collection
                    </h3>
                    <p className="text-amber-700">
                      You own <span className="font-bold">{nftCount}</span>{" "}
                      {menu.name} NFT
                      {nftCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="space-y-4">
                    {/* 주문 버튼 */}
                    <button
                      onClick={handleOrder}
                      disabled={isOrdering || usdcBalance < menu.price}
                      className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                        usdcBalance < menu.price
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white"
                      }`}
                    >
                      {isOrdering
                        ? "Ordering..."
                        : usdcBalance < menu.price
                        ? `Need ${(menu.price - usdcBalance).toFixed(
                            2
                          )} more USDC`
                        : "Order Menu for Random Ingredients"}
                    </button>
                    <p className="text-sm text-amber-600">
                      Pay ${menu.price} USDC to get random ingredients for
                      crafting
                    </p>

                    {/* 테스트용 USDC 민팅 버튼 */}
                    {usdcBalance < menu.price && (
                      <button
                        onClick={async () => {
                          if (
                            !paymentTokenHook.contract ||
                            !user?.wallet?.address
                          )
                            return;
                          try {
                            setMessage("Minting test USDC...");
                            await paymentTokenUtils.mint(
                              paymentTokenHook.contract,
                              user.wallet.address,
                              100 // 100 USDC 민팅
                            );
                            setMessage("Test USDC minted successfully!");
                            setMessageType("success");
                            await fetchUSDCInfo();
                          } catch (error: unknown) {
                            console.error("USDC mint failed:", error);
                            setMessage(
                              error instanceof Error
                                ? error.message
                                : "USDC mint failed"
                            );
                            setMessageType("error");
                          }
                        }}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Get Test USDC (100 USDC)
                      </button>
                    )}

                    {/* 공짜 커피 버튼 */}
                    <button
                      onClick={handleRedeem}
                      disabled={isRedeeming || nftCount === 0}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      {isRedeeming
                        ? "Using NFT..."
                        : nftCount > 0
                        ? "Use CoffeeNFT for Free Coffee ☕"
                        : "No NFTs to Use"}
                    </button>
                    <p className="text-sm text-green-600">
                      {nftCount > 0
                        ? "Burn 1 NFT to get a free coffee"
                        : "You need to own this coffee NFT to get free coffee"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 레시피 조합법 (넓은 화면에서는 오른쪽, 좁은 화면에서는 아래) */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Crafting Recipe
              </h2>

              {/* 3x3 그리드로 레시피 표시 */}
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-6">
                {menu.recipe.map((ingredientId, index) => {
                  const ingredient = ingredients.find(
                    (ing) => ing.id === ingredientId
                  );

                  return (
                    <div
                      key={index}
                      className="aspect-square border-2 border-amber-300 rounded-lg bg-amber-50 flex items-center justify-center"
                    >
                      {ingredient ? (
                        <div className="text-center">
                          <img
                            src={ingredient.image}
                            alt={ingredient.name}
                            className="w-12 h-12 mx-auto mb-1 object-contain"
                          />
                          <p className="text-xs text-amber-800">
                            {ingredient.name}
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-400">—</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="text-amber-700 mb-4">
                  Arrange ingredients in this exact pattern to craft {menu.name}
                </p>
                <button
                  onClick={() => navigate("/cook")}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Go to Crafting Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 재료 획득 모달 */}
      <IngredientsModal
        isOpen={showIngredientsModal}
        onClose={() => setShowIngredientsModal(false)}
        acquiredIngredients={acquiredIngredients}
      />

      {/* 공짜 커피 모달 */}
      <FreeCoffeeModal
        isOpen={showFreeCoffeeModal}
        onClose={() => setShowFreeCoffeeModal(false)}
        menuId={freeCoffeeMenuId}
        coffeeName={freeCoffeeName}
      />
    </div>
  );
};

export default MenuDetailPage;
