import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrivyProvider } from "@privy-io/react-auth";

const worldSep = {
  id: 4801,
  name: "World Chain Sepolia",
  network: "world-chain-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://worldchain-sepolia.g.alchemy.com/public"] },
  },
  blockExplorers: {
    default: {
      name: "World Chain Sepolia Explorer",
      url: "https://worldchain-sepolia.explorer.alchemy.com",
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      defaultChain: worldSep,
      supportedChains: [worldSep],
    }}
  >
    <App />
  </PrivyProvider>
);
