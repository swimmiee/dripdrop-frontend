import { useState } from "react";
import {
  usePrivy,
  useWallets,
  useSendTransaction,
  useSignMessage
} from '@privy-io/react-auth';
import { parseEther } from 'ethers';

export default function WalletDemo() {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
  
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the first wallet address if available
  const primaryWallet = wallets[0];
  const address = primaryWallet?.address;

  // Handle sending 0 ETH to self
  const handleSendTransaction = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const result = await sendTransaction({
        to: address,
        value: parseEther('0') // 0 ETH transaction
      });
      setTransactionHash(result.transactionHash);
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signing message
  const handleSignMessage = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const result = await signMessage({
        message: `Hello from ${address}` // Sign greeting message with address
      });
      setSignature(result);
    } catch (error) {
      console.error('Signing failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Privy Wallet Demo
      </h2>
      
      {!authenticated ? (
        <div className="text-center">
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Login with Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display wallet address */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700">Primary Wallet:</p>
            <p className="text-xs text-gray-600 font-mono break-all">
              {address || "No wallet connected"}
            </p>
          </div>

          {/* Send 0 ETH button */}
          <button
            onClick={handleSendTransaction}
            disabled={!address || isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? "Sending..." : "Send 0 ETH to myself"}
          </button>

          {/* Sign message button */}
          <button
            onClick={handleSignMessage}
            disabled={!address || isLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? "Signing..." : "Sign message"}
          </button>

          {/* Display transaction hash */}
          {transactionHash && (
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm font-medium text-green-700">Transaction Hash:</p>
              <p className="text-xs text-green-600 font-mono break-all">
                {transactionHash}
              </p>
            </div>
          )}

          {/* Display signature */}
          {signature && (
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-sm font-medium text-purple-700">Signature:</p>
              <p className="text-xs text-purple-600 font-mono break-all">
                {signature}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 