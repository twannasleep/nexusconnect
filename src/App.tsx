import { RootWalletDialog } from "./components/RootWalletDialog";
import { WalletTest } from "./components/WalletTest";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1>Wallet Connection Test</h1>
      <WalletTest />
      <RootWalletDialog />
    </div>
  );
}
