"use client";
import type { AppProps } from "next/app";
/* <--------------- Styles Imports ---------------> */
import "../styles/globals.css";
import Providers from "@/utils/providers";
import Navbar from "@/components/Navbar";
import { useAnonAadhaar } from "anon-aadhaar-react";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);
  return (
    <Providers>
      <div className="relative min-h-screen">
        <Navbar />
        {/* {anonAadhaar?.status === "logged-in" &&  */}
        <Component {...pageProps} />
        {/* } */}
        <div></div>
      </div>
    </Providers>
  );
}
export default MyApp;
