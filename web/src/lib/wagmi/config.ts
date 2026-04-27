import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
];

if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
  );
}

export const appChains = [base, mainnet] as const;

export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? base.id);

export const wagmiConfig = createConfig({
  chains: appChains,
  connectors,
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
