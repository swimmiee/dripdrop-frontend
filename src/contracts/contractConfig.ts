export const CONTRACT_ADDRESSES = {
  WORLDCHAIN_SEPOLIA: {
    MOCK_PAYMENT_TOKEN: "0x0303aA26DD3e3eA186af61BCbd0760005bDCbF93", // USDC 토큰
    DRIPDROP_CAFE: "0x3AD2A1cad99819C1d873c735E9386fDd9ff85D2B", // 메인 게임 컨트랙트
    INGREDIENT_TOKEN: "0x09b1621A8534cFf7a4cED78Ce2D15BF758720F00", // 재료 토큰
    COFFEE_NFT: "0x61906Dde1D63233fe3abBBcDcA2A7a4E13703341", // 커피 NFT
  },
} as const;

export const SUPPORTED_CHAINS = {
  WORLDCHAIN_SEPOLIA: 4801,
} as const;

export const getContractAddress = (
  chainId: number,
  contractName: keyof typeof CONTRACT_ADDRESSES.WORLDCHAIN_SEPOLIA
) => {
  switch (chainId) {
    case SUPPORTED_CHAINS.WORLDCHAIN_SEPOLIA:
      return CONTRACT_ADDRESSES.WORLDCHAIN_SEPOLIA[contractName];
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};
