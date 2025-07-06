import { Contract, ethers } from "ethers";
import { getContractAddress } from "./contractConfig";
import type { ContractName } from "./types";

// ABI 파일들을 import
import MockPaymentTokenABI from "./abis/MockPaymentToken.json";
import DripDropCafeABI from "./abis/DripDropCafe.json";
import IngredientTokenABI from "./abis/IngredientToken.json";
import CoffeeNFTABI from "./abis/CoffeeNFT.json";

/**
 * 컨트랙트 인스턴스를 생성하는 함수
 * @param contractName 컨트랙트 이름
 * @param provider ethers provider 또는 signer
 * @param chainId 체인 ID
 * @returns Contract 인스턴스
 */
export const getContract = (
  contractName: ContractName,
  provider: ethers.Provider | ethers.Signer,
  chainId: number
): Contract => {
  const address = getContractAddress(chainId, contractName);

  let abi;
  switch (contractName) {
    case "MOCK_PAYMENT_TOKEN":
      abi = MockPaymentTokenABI.abi;
      break;
    case "DRIPDROP_CAFE":
      abi = DripDropCafeABI.abi;
      break;
    case "INGREDIENT_TOKEN":
      abi = IngredientTokenABI.abi;
      break;
    case "COFFEE_NFT":
      abi = CoffeeNFTABI.abi;
      break;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }

  return new Contract(address, abi, provider);
};

/**
 * 재료 토큰 컨트랙트 관련 함수들
 */
export const ingredientTokenUtils = {
  /**
   * 플레이어의 재료 잔액을 조회
   * @param contract IngredientToken 컨트랙트 인스턴스
   * @param playerAddress 플레이어 주소
   * @param ingredientId 재료 ID
   * @returns 재료 잔액
   */
  async getIngredientBalance(
    contract: Contract,
    playerAddress: string,
    ingredientId: number
  ): Promise<number> {
    if (!contract.balanceOf) throw new Error("Contract method not found");
    const balance = await contract.balanceOf(playerAddress, ingredientId);
    return Number(balance);
  },

  /**
   * 재료 토큰을 민팅
   * @param contract IngredientToken 컨트랙트 인스턴스 (signer 필요)
   * @param toAddress 받을 주소
   * @param ingredientId 재료 ID
   * @param amount 수량
   * @returns 트랜잭션 결과
   */
  async mintIngredient(
    contract: Contract,
    toAddress: string,
    ingredientId: number,
    amount: number
  ) {
    if (!contract.mint) throw new Error("Contract method not found");
    const tx = await contract.mint(toAddress, ingredientId, amount, "0x");
    return await tx.wait();
  },

  /**
   * 재료 토큰 전송 승인
   * @param contract IngredientToken 컨트랙트 인스턴스 (signer 필요)
   * @param operator 승인할 주소 (보통 DripDropCafe 컨트랙트)
   * @param approved 승인 여부
   * @returns 트랜잭션 결과
   */
  async setApprovalForAll(
    contract: Contract,
    operator: string,
    approved: boolean
  ) {
    if (!contract.setApprovalForAll)
      throw new Error("Contract method not found");
    const tx = await contract.setApprovalForAll(operator, approved);
    return await tx.wait();
  },
};

/**
 * DripDrop 카페 컨트랙트 관련 함수들
 */
export const dripDropCafeUtils = {
  /**
   * 재료 구매
   * @param contract DripDropCafe 컨트랙트 인스턴스 (signer 필요)
   * @param ingredientId 재료 ID
   * @param amount 수량
   * @returns 트랜잭션 결과
   */
  async buyIngredient(
    contract: Contract,
    ingredientId: number,
    amount: number
  ) {
    if (!contract.buyIngredient) throw new Error("Contract method not found");
    const tx = await contract.buyIngredient(ingredientId, amount);
    return await tx.wait();
  },

  /**
   * 커피 제작
   * @param contract DripDropCafe 컨트랙트 인스턴스 (signer 필요)
   * @param menuId 메뉴 ID
   * @param pattern 9칸 패턴 배열 (재료 ID들)
   * @returns 트랜잭션 결과
   */
  async craftCoffee(contract: Contract, menuId: number, pattern: number[]) {
    if (!contract.craftCoffee) throw new Error("Contract method not found");

    // 9칸 패턴 검증
    if (pattern.length !== 9) {
      throw new Error("Pattern must be exactly 9 elements");
    }

    // uint8[9] 형태로 변환
    const uint8Pattern = pattern.map((id) => Math.max(0, Math.min(255, id)));

    const tx = await contract.craftCoffee(menuId, uint8Pattern);
    return await tx.wait();
  },

  /**
   * 재료 가격 조회
   * @param contract DripDropCafe 컨트랙트 인스턴스
   * @param ingredientId 재료 ID
   * @returns 재료 가격
   */
  async getIngredientPrice(
    contract: Contract,
    ingredientId: number
  ): Promise<number> {
    if (!contract.ingredientPrices)
      throw new Error("Contract method not found");
    const price = await contract.ingredientPrices(ingredientId);
    return Number(price);
  },

  /**
   * 플레이어가 소유한 커피 NFT 목록 조회
   * @param contract DripDropCafe 컨트랙트 인스턴스
   * @param playerAddress 플레이어 주소
   * @returns 커피 토큰 ID 배열
   */
  async getPlayerCoffees(
    contract: Contract,
    playerAddress: string
  ): Promise<number[]> {
    if (!contract.getPlayerCoffees)
      throw new Error("Contract method not found");
    const coffeeIds = await contract.getPlayerCoffees(playerAddress);
    return coffeeIds.map((id: unknown) => Number(id));
  },

  /**
   * 패턴으로 매칭되는 레시피 찾기 (컨트랙트 뷰 함수)
   * @param contract DripDropCafe 컨트랙트 인스턴스
   * @param pattern 9칸 패턴 배열 (재료 ID들)
   * @returns 매칭되는 메뉴 ID (0이면 매칭 없음)
   */
  async findMatchingRecipe(
    contract: Contract,
    pattern: number[]
  ): Promise<number> {
    if (pattern.length !== 9) return 0;
    if (!contract.findMatchingRecipe)
      throw new Error("Contract method not found");

    const uint8Pattern = pattern.map((id) => Math.max(0, Math.min(255, id)));
    const menuId = await contract.findMatchingRecipe(uint8Pattern);
    return Number(menuId);
  },

  /**
   * 메뉴 주문 (재료 구매)
   * @param contract DripDropCafe 컨트랙트 인스턴스 (signer 필요)
   * @param menuId 메뉴 ID
   * @returns 트랜잭션 결과
   */
  async orderMenu(contract: Contract, menuId: number) {
    if (!contract.orderMenu) throw new Error("Contract method not found");
    const tx = await contract.orderMenu(menuId);
    return await tx.wait();
  },

  /**
   * NFT 소모하여 무료 커피 받기 (NFT burn)
   * @param contract DripDropCafe 컨트랙트 인스턴스 (signer 필요)
   * @param tokenId NFT 토큰 ID
   * @returns 트랜잭션 결과
   */
  async burnCoffeeNFTForFreeCoffee(contract: Contract, tokenId: number) {
    if (!contract.burnCoffeeNFT) throw new Error("Contract method not found");
    const tx = await contract.burnCoffeeNFT(tokenId);
    return await tx.wait();
  },

  /**
   * NFT 소모하여 무료 커피 받기 (레거시 함수명)
   * @param contract DripDropCafe 컨트랙트 인스턴스 (signer 필요)
   * @param tokenId NFT 토큰 ID
   * @returns 트랜잭션 결과
   */
  async redeemCoffeeNFT(contract: Contract, tokenId: number) {
    // burnCoffeeNFT 함수 사용
    return await this.burnCoffeeNFTForFreeCoffee(contract, tokenId);
  },

  /**
   * 메뉴 가격 조회
   * @param contract DripDropCafe 컨트랙트 인스턴스
   * @param menuId 메뉴 ID
   * @returns 메뉴 가격 (USDC)
   */
  async getMenuPrice(contract: Contract, menuId: number): Promise<number> {
    if (!contract.getMenuPrice) throw new Error("Contract method not found");
    const price = await contract.getMenuPrice(menuId);
    return Number(price) / 1e6; // USDC는 6자리 소수점
  },

  /**
   * 메뉴 가격 직접 조회 (mapping)
   * @param contract DripDropCafe 컨트랙트 인스턴스
   * @param menuId 메뉴 ID
   * @returns 메뉴 가격 (USDC)
   */
  async getMenuPriceFromMapping(
    contract: Contract,
    menuId: number
  ): Promise<number> {
    if (!contract.menuPrices) throw new Error("Contract method not found");
    const price = await contract.menuPrices(menuId);
    return Number(price) / 1e6; // USDC는 6자리 소수점
  },
};

/**
 * 커피 NFT 컨트랙트 관련 함수들
 */
export const coffeeNFTUtils = {
  /**
   * 커피 NFT 소유자 조회
   * @param contract CoffeeNFT 컨트랙트 인스턴스
   * @param tokenId 토큰 ID
   * @returns 소유자 주소
   */
  async getOwner(contract: Contract, tokenId: number): Promise<string> {
    if (!contract.ownerOf) throw new Error("Contract method not found");
    return await contract.ownerOf(tokenId);
  },

  /**
   * 플레이어가 소유한 커피 NFT 개수 조회
   * @param contract CoffeeNFT 컨트랙트 인스턴스
   * @param playerAddress 플레이어 주소
   * @returns NFT 개수
   */
  async getBalance(contract: Contract, playerAddress: string): Promise<number> {
    if (!contract.balanceOf) throw new Error("Contract method not found");
    const balance = await contract.balanceOf(playerAddress);
    return Number(balance);
  },

  /**
   * 특정 메뉴의 사용자 NFT 토큰 ID 목록 조회
   * @param contract CoffeeNFT 컨트랙트 인스턴스
   * @param userAddress 사용자 주소
   * @param menuId 메뉴 ID
   * @returns 해당 메뉴 NFT 토큰 ID 배열
   */
  async getUserMenuNFTs(
    contract: Contract,
    userAddress: string,
    menuId: number
  ): Promise<number[]> {
    if (!contract.getUserMenuNFTs) throw new Error("Contract method not found");
    const tokenIds = await contract.getUserMenuNFTs(userAddress, menuId);
    return tokenIds.map((id: unknown) => Number(id));
  },

  /**
   * 특정 메뉴의 NFT 개수 조회 (getUserMenuNFTs 이용)
   * @param contract CoffeeNFT 컨트랙트 인스턴스
   * @param userAddress 사용자 주소
   * @param menuId 메뉴 ID
   * @returns 해당 메뉴 NFT 개수
   */
  async getMenuNFTCount(
    contract: Contract,
    userAddress: string,
    menuId: number
  ): Promise<number> {
    try {
      const tokenIds = await this.getUserMenuNFTs(
        contract,
        userAddress,
        menuId
      );
      return tokenIds.length;
    } catch (error) {
      console.error("Failed to get menu NFT count:", error);
      return 0;
    }
  },
};

/**
 * 결제 토큰 컨트랙트 관련 함수들
 */
export const paymentTokenUtils = {
  /**
   * 토큰 잔액 조회
   * @param contract MockPaymentToken 컨트랙트 인스턴스
   * @param playerAddress 플레이어 주소
   * @returns 토큰 잔액
   */
  async getBalance(contract: Contract, playerAddress: string): Promise<number> {
    if (!contract.balanceOf) throw new Error("Contract method not found");
    const balance = await contract.balanceOf(playerAddress);
    return Number(balance) / 1e6; // USDC는 6자리 소수점
  },

  /**
   * 토큰 승인
   * @param contract MockPaymentToken 컨트랙트 인스턴스 (signer 필요)
   * @param spender 승인할 주소 (보통 DripDropCafe 컨트랙트)
   * @param amount 승인할 수량
   * @returns 트랜잭션 결과
   */
  async approve(contract: Contract, spender: string, amount: number) {
    if (!contract.approve) throw new Error("Contract method not found");
    const tx = await contract.approve(spender, amount * 1e6); // USDC 단위로 변환
    return await tx.wait();
  },

  /**
   * 테스트용 토큰 민팅
   * @param contract MockPaymentToken 컨트랙트 인스턴스 (signer 필요)
   * @param toAddress 받을 주소
   * @param amount 수량
   * @returns 트랜잭션 결과
   */
  async mint(contract: Contract, toAddress: string, amount: number) {
    if (!contract.mint) throw new Error("Contract method not found");
    const tx = await contract.mint(toAddress, amount * 1e6); // USDC 단위로 변환
    return await tx.wait();
  },
};

/**
 * 에러 처리 유틸리티
 */
export const handleContractError = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "ACTION_REJECTED"
  ) {
    return "트랜잭션이 사용자에 의해 거부되었습니다.";
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "INSUFFICIENT_FUNDS"
  ) {
    return "잔액이 부족합니다.";
  }

  if (error instanceof Error && error.message?.includes("execution reverted")) {
    return "컨트랙트 실행이 실패했습니다. 조건을 확인해주세요.";
  }

  return error instanceof Error && error.message
    ? error.message
    : "알 수 없는 오류가 발생했습니다.";
};
