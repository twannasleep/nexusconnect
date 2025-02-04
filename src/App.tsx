import { useWalletDialogStore } from "./core/store/useWalletDialogStore";
import { useWalletStore } from "./core/store/useWalletStore";
import { ChainSelector, ConnectButton, WalletDialog } from "./ui/components";

const App: React.FC = () => {
  const { isOpen, openDialog, closeDialog, pendingChain } =
    useWalletDialogStore();
  const { chain } = useWalletStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <ChainSelector />
      <ConnectButton />
      <WalletDialog
        open={isOpen}
        onOpenChange={(open) => (open ? openDialog() : closeDialog())}
        pendingChain={pendingChain || chain}
      />
    </main>
  );
};

export default App;
