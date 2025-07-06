import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useDripDropCafe,
  useIngredientToken,
  usePaymentToken,
  useCoffeeNFT,
} from "../hooks/useContract";
import {
  dripDropCafeUtils,
  ingredientTokenUtils,
  paymentTokenUtils,
  coffeeNFTUtils,
  handleContractError,
} from "../contracts/contractUtils";
import { getContractAddress } from "../contracts/contractConfig";

export default function ContractDemo() {
  const { authenticated } = usePrivy();

  // 컨트랙트 훅들
  const cafeContract = useDripDropCafe(true); // signer 필요
  const ingredientContract = useIngredientToken(true); // signer 필요 (승인을 위해)
  const paymentContract = usePaymentToken(true); // signer 필요
  const coffeeContract = useCoffeeNFT(false); // 읽기 전용

  // 상태 관리
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [ingredientBalance, setIngredientBalance] = useState<number>(0);
  const [coffeeCount, setCoffeeCount] = useState<number>(0);
  const [ingredientPrice, setIngredientPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (authenticated && cafeContract.walletAddress) {
      loadBalances();
      loadIngredientPrice();
    }
  }, [authenticated, cafeContract.walletAddress]);

  const loadBalances = async () => {
    try {
      if (!cafeContract.walletAddress) return;

      // USDC 잔액 조회
      if (paymentContract.contract) {
        const balance = await paymentTokenUtils.getBalance(
          paymentContract.contract,
          cafeContract.walletAddress
        );
        setUsdcBalance(balance);
      }

      // 재료 잔액 조회 (재료 ID 0번 예시)
      if (ingredientContract.contract) {
        const balance = await ingredientTokenUtils.getIngredientBalance(
          ingredientContract.contract,
          cafeContract.walletAddress,
          0
        );
        setIngredientBalance(balance);
      }

      // 커피 NFT 개수 조회
      if (coffeeContract.contract) {
        const count = await coffeeNFTUtils.getBalance(
          coffeeContract.contract,
          cafeContract.walletAddress
        );
        setCoffeeCount(count);
      }
    } catch (err) {
      console.error("Balance loading failed:", err);
    }
  };

  const loadIngredientPrice = async () => {
    try {
      if (cafeContract.contract) {
        const price = await dripDropCafeUtils.getIngredientPrice(
          cafeContract.contract,
          0 // 재료 ID 0번
        );
        setIngredientPrice(price / 1e6); // USDC 단위로 변환
      }
    } catch (err) {
      console.error("Price loading failed:", err);
    }
  };

  // 테스트용 USDC 민팅
  const handleMintUSDC = async () => {
    if (!paymentContract.contract || !cafeContract.walletAddress) return;

    try {
      setIsLoading(true);
      setError(null);

      await paymentTokenUtils.mint(
        paymentContract.contract,
        cafeContract.walletAddress,
        100 // 100 USDC
      );

      // 잔액 새로고침
      await loadBalances();
      alert("100 USDC가 민팅되었습니다!");
    } catch (err) {
      const errorMessage = handleContractError(err);
      setError(errorMessage);
      console.error("USDC minting failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 재료 구매
  const handleBuyIngredient = async () => {
    if (!cafeContract.contract || !paymentContract.contract) return;

    try {
      setIsLoading(true);
      setError(null);

      // 먼저 USDC 승인
      const cafeAddress = getContractAddress(
        cafeContract.chainId,
        "DRIPDROP_CAFE"
      );
      await paymentTokenUtils.approve(
        paymentContract.contract,
        cafeAddress,
        ingredientPrice * 1 // 1개 구매 분량
      );

      // 재료 구매
      await dripDropCafeUtils.buyIngredient(
        cafeContract.contract,
        0, // 재료 ID 0번
        1 // 1개 구매
      );

      // 잔액 새로고침
      await loadBalances();
      alert("재료를 구매했습니다!");
    } catch (err) {
      const errorMessage = handleContractError(err);
      setError(errorMessage);
      console.error("Ingredient purchase failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 커피 제작
  const handleCraftCoffee = async () => {
    if (!cafeContract.contract || !ingredientContract.contract) return;

    try {
      setIsLoading(true);
      setError(null);

      // 재료 토큰 사용 승인
      const cafeAddress = getContractAddress(
        cafeContract.chainId,
        "DRIPDROP_CAFE"
      );
      await ingredientTokenUtils.setApprovalForAll(
        ingredientContract.contract,
        cafeAddress,
        true
      );

      // 커피 제작 (재료 ID 0번을 1개 사용)
      await dripDropCafeUtils.craftCoffee(
        cafeContract.contract,
        [0], // 재료 ID 배열
        [1] // 수량 배열
      );

      // 잔액 새로고침
      await loadBalances();
      alert("커피를 제작했습니다!");
    } catch (err) {
      const errorMessage = handleContractError(err);
      setError(errorMessage);
      console.error("Coffee crafting failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          컨트랙트 데모
        </h2>
        <p className="text-center text-gray-600">먼저 지갑을 연결해주세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        DripDrop 컨트랙트 데모
      </h2>

      {/* 잔액 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">USDC 잔액</h3>
          <p className="text-2xl font-bold text-blue-600">{usdcBalance}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">재료 (ID:0)</h3>
          <p className="text-2xl font-bold text-green-600">
            {ingredientBalance}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">커피 NFT</h3>
          <p className="text-2xl font-bold text-purple-600">{coffeeCount}</p>
        </div>
      </div>

      {/* 재료 가격 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800">재료 가격 (ID:0)</h3>
        <p className="text-lg text-gray-600">{ingredientPrice} USDC</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="space-y-4">
        <button
          onClick={handleMintUSDC}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? "처리 중..." : "테스트용 USDC 100개 민팅"}
        </button>

        <button
          onClick={handleBuyIngredient}
          disabled={isLoading || usdcBalance < ingredientPrice}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? "처리 중..." : "재료 구매 (1개)"}
        </button>

        <button
          onClick={handleCraftCoffee}
          disabled={isLoading || ingredientBalance < 1}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? "처리 중..." : "커피 제작"}
        </button>

        <button
          onClick={loadBalances}
          disabled={isLoading}
          className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? "처리 중..." : "잔액 새로고침"}
        </button>
      </div>

      {/* 컨트랙트 주소 정보 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">컨트랙트 주소</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>USDC: 0x0e1E1787d384992064958B49f8D20f305D12D7a1</div>
          <div>Cafe: 0x2fc1c9B3a3B089Cd4f5FB9E2Ca008Af8FF8C8C31</div>
          <div>Ingredient: 0x620545FDad6Bc3091A8f5ee32824d25DC31BC9fa</div>
          <div>Coffee NFT: 0x6570D3EB9CC5740dcE8918C69Ffe7E6C69501206</div>
        </div>
      </div>
    </div>
  );
}
