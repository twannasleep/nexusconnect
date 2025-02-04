import { Chain, http } from "viem";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defaultEVMChains } from "./chains";

// Cast our EVM chains to Wagmi's Chain type
const EVM_CHAINS = defaultEVMChains as unknown as [Chain, ...Chain[]];

// Create transports for each chain
const transports = Object.fromEntries(
  defaultEVMChains.map((chain) => [chain.id, http()]),
);

// Export the Wagmi config
export const wagmiConfig = createConfig({
  chains: EVM_CHAINS,
  connectors: [injected()],
  transports,
});
