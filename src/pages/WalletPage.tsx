import React from "react";
import { usePrivy } from "@privy-io/react-auth";

const WalletPage: React.FC = () => {
  const { user, authenticated } = usePrivy();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            Wallet Not Connected
          </h1>
          <p className="text-lg text-amber-700 mb-6">
            Please connect your wallet using the button in the header.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">
          💼 Your Wallet
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            Wallet Information
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
              <span className="text-amber-700 font-medium">
                Wallet Address:
              </span>
              <span className="text-amber-900 font-mono">
                {user?.wallet?.address}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">
                Connection Status:
              </span>
              <span className="text-green-800 font-semibold">✅ Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="p-4 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors"
            >
              <div className="text-amber-800 font-semibold">🏠 Go to Home</div>
              <div className="text-amber-600 text-sm">Browse coffee menu</div>
            </button>

            <button
              onClick={() => (window.location.href = "/cook")}
              className="p-4 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors"
            >
              <div className="text-amber-800 font-semibold">
                ⚡ Start Crafting
              </div>
              <div className="text-amber-600 text-sm">Create coffee NFTs</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
