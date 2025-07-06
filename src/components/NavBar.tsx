import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { usePaymentToken } from "../hooks/useContract";
import { paymentTokenUtils } from "../contracts/contractUtils";

function NavBar() {
  const { login, logout, user, authenticated } = usePrivy();
  const paymentTokenHook = usePaymentToken();
  const [usdcBalance, setUsdcBalance] = useState<number>(0);

  // USDC 잔액 조회
  const fetchUSDCBalance = async () => {
    if (!user?.wallet?.address || !paymentTokenHook.contract) return;

    try {
      const balance = await paymentTokenUtils.getBalance(
        paymentTokenHook.contract,
        user.wallet.address
      );
      setUsdcBalance(balance);
    } catch (error) {
      console.error("Failed to fetch USDC balance:", error);
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUSDCBalance();
      // 10초마다 잔액 업데이트
      const interval = setInterval(fetchUSDCBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [authenticated, user, paymentTokenHook.contract]);

  // 주소 축약 함수
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-amber-100 border-b border-amber-200 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 로고 */}
        <div className="flex items-center">
          <h1
            className="text-2xl font-bold text-amber-900 cursor-pointer hover:text-amber-700 transition-colors"
            onClick={() => (window.location.href = "/")}
          >
            ☕ DripDrop
          </h1>
        </div>

        {/* 네비게이션 메뉴 */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-amber-800 hover:bg-amber-200"
              }`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/cook"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-amber-800 hover:bg-amber-200"
              }`
            }
          >
            Craft
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-amber-800 hover:bg-amber-200"
              }`
            }
          >
            Inventory
          </NavLink>
        </div>

        {/* 지갑 연결 영역 */}
        <div className="flex items-center space-x-4">
          {/* USDC 잔액 (로그인 시에만 표시) */}
          {authenticated && (
            <div className="flex items-center bg-blue-100 px-3 py-2 rounded-lg border border-blue-200">
              <div className="text-blue-800 font-medium">
                💰 {usdcBalance.toFixed(2)} USDC
              </div>
            </div>
          )}

          {/* 지갑 연결 버튼 */}
          {authenticated ? (
            <div className="flex items-center space-x-2">
              {/* 주소 표시 */}
              <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-200">
                <div className="text-green-800 font-mono text-sm">
                  {truncateAddress(user?.wallet?.address || "")}
                </div>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
