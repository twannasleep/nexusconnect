import { useWalletStore } from "./core/store/useWalletStore";
import { ChainSelector, ConnectButton, WalletDialog } from "./ui/components";

const App: React.FC = () => {
  const { isDialogOpen, toggleDialog, pendingChain } = useWalletStore();
  const { chain } = useWalletStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <ChainSelector />
      <ConnectButton />
      <WalletDialog
        open={isDialogOpen}
        onOpenChange={(open) =>
          open ? toggleDialog(true) : toggleDialog(false)
        }
        pendingChain={pendingChain || chain}
      />
    </main>
  );
};

export default App;
