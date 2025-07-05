import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CookPage from "./pages/CookPage";
import WalletDemo from "./components/WalletDemo";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cook" element={<CookPage />} />
            <Route path="/wallet" element={<WalletDemo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
