"use client";
import { useState, ReactNode, useEffect } from "react";
/* <--------------- Rainbow Kit Imports ---------------> */
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
const app_id = process.env.NEXT_PUBLIC_APP_ID || "";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
/* <--------------- Wagmi Imports ---------------> */
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, goerli, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
/*<------  Custom Chains imports  ------> */
import "@/utils/customChains";
/* <------  Waku Protocol Imports  ------>*/
import { LightNodeProvider } from "@waku/react";
// Waku node options
const NODE_OPTIONS = { defaultBootstrap: true };

// Chains setup
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, goerli, polygonMumbai],
  [publicProvider()]
);
// Wallet setup
const projectId: string =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
const { wallets } = getDefaultWallets({
  appName: "Template",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Template",
};
// Connectors & Wallets
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);
// Wagmi Config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

interface Props {
  children: ReactNode;
}
export function Providers({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          lightMode: lightTheme({ overlayBlur: "small" }),
          darkMode: darkTheme({ overlayBlur: "small" }),
        }}
      >
        <LightNodeProvider options={NODE_OPTIONS}>
          {mounted && children}
        </LightNodeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
export default Providers;
