import { WalletDialog } from "./WalletDialog";
import { useWalletDialogStore } from "../store/useWalletDialogStore";

export function RootWalletDialog() {
  const { isOpen, pendingChain, setIsOpen } = useWalletDialogStore();

  return (
    <WalletDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      pendingChain={pendingChain}
    />
  );
}
