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
      <div className="min-h-screen">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </Providers>
  );
}
export default MyApp;
