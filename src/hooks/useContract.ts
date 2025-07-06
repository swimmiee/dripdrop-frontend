import { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { getContract, handleContractError } from "../contracts/contractUtils";
import type { ContractName } from "../contracts/types";

/**
 * 컨트랙트 사용을 위한 훅
 * @param contractName 컨트랙트 이름
 * @param needsSigner 트랜잭션 전송을 위해 signer가 필요한지 여부
 * @returns 컨트랙트 인스턴스와 관련 상태
 */
export const useContract = (
  contractName: ContractName,
  needsSigner: boolean = false
) => {
  const { wallets } = useWallets();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryWallet = wallets[0];
  const chainId =
    typeof primaryWallet?.chainId === "number" ? primaryWallet.chainId : 4801; // 기본값: Worldchain Sepolia

  useEffect(() => {
    const initContract = async () => {
      if (!primaryWallet) {
        setContract(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let provider: ethers.Provider | ethers.Signer;

        if (needsSigner) {
          // 트랜잭션을 위한 signer 필요
          const ethereumProvider = await primaryWallet.getEthereumProvider();
          const web3Provider = new ethers.BrowserProvider(ethereumProvider);
          provider = await web3Provider.getSigner();
        } else {
          // 읽기 전용 provider
          const ethereumProvider = await primaryWallet.getEthereumProvider();
          provider = new ethers.BrowserProvider(ethereumProvider);
        }

        const contractInstance = getContract(contractName, provider, chainId);
        setContract(contractInstance);
      } catch (err) {
        console.error("Contract initialization failed:", err);
        setError(handleContractError(err));
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [primaryWallet, contractName, needsSigner, chainId]);

  return {
    contract,
    isLoading,
    error,
    chainId,
    walletAddress: primaryWallet?.address || null,
  };
};

/**
 * 재료 토큰 컨트랙트 전용 훅
 */
export const useIngredientToken = (needsSigner: boolean = false) => {
  return useContract("INGREDIENT_TOKEN", needsSigner);
};

/**
 * DripDrop 카페 컨트랙트 전용 훅
 */
export const useDripDropCafe = (needsSigner: boolean = false) => {
  return useContract("DRIPDROP_CAFE", needsSigner);
};

/**
 * 커피 NFT 컨트랙트 전용 훅
 */
export const useCoffeeNFT = (needsSigner: boolean = false) => {
  return useContract("COFFEE_NFT", needsSigner);
};

/**
 * 결제 토큰 컨트랙트 전용 훅
 */
export const usePaymentToken = (needsSigner: boolean = false) => {
  return useContract("MOCK_PAYMENT_TOKEN", needsSigner);
};

/**
 * 컨트랙트 함수 호출을 위한 훅
 * @param contractHook 사용할 컨트랙트 훅
 * @param functionName 호출할 함수 이름
 * @returns 함수 호출 상태와 실행 함수
 */
export const useContractFunction = <T = unknown>(
  contractHook: ReturnType<typeof useContract>,
  functionName: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const execute = async (...args: unknown[]) => {
    if (!contractHook.contract) {
      setError("컨트랙트가 초기화되지 않았습니다.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contractFunction = contractHook.contract[functionName];
      if (typeof contractFunction !== "function") {
        throw new Error(`Function ${functionName} does not exist on contract`);
      }

      const result = await contractFunction(...args);
      setResult(result);
      return result;
    } catch (err) {
      console.error(`Contract function ${functionName} failed:`, err);
      const errorMessage = handleContractError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    error,
    result,
  };
};
