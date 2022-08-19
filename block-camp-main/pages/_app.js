// 1. import `NextUIProvider` component
import { NextUIProvider, Card, Text, Row, Container } from "@nextui-org/react";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/next.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Headers from "../components/Header";

function MyApp({ Component, pageProps }) {
  const { chains, provider,webSocketProvider } = configureChains(
    [chain.goerli],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });
  const demoAppInfo = {
    appName: "My RainbowKit App",
  };

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <NextUIProvider>
          <Headers />
          <Component {...pageProps} />
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
