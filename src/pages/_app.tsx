"use client";
import type { AppProps } from "next/app";
/* <--------------- Styles Imports ---------------> */
import "../styles/globals.css";
import Providers from "@/utils/providers";
import Navbar from "@/components/Navbar";
// import { useAnonAadhaar } from "anon-aadhaar-react";

function MyApp({ Component, pageProps }: AppProps) {
  // const [anonAadhaar] = useAnonAadhaar();
  return (
    <Providers>
      <Navbar />
      <Component {...pageProps} />
    </Providers>
  );
}
export default MyApp;
