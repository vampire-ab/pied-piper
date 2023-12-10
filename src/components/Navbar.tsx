import { usePeers } from "@huddle01/react/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import Image from "next/image";
import { useEnsAvatar, useEnsName } from "wagmi";


export default function Navbar() {
  const { } = usePeers();
  const [anonAadhaar] = useAnonAadhaar();
  const { data: ensName } = useEnsName();
  const { data: ensAvatar } = useEnsAvatar();
  return (
    <div className="flex px-7 py-4 h-[100px] justify-between">
      <div className="">
        <div>
          <div className="welcome text-xl">Open Science Snapshot</div>
          {/* {JSON.stringify(peers)} */}
        </div>
      </div>
      {/* {!anonAadhaar || anonAadhaar?.status !== "logged-in" ? */}
        <LogInWithAnonAadhaar />
        {/* : <></>} */}
      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            return (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!mounted || !account || !chain) {
                    return (
                      <button onClick={openConnectModal} type="button">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <Image
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                width={12}
                                height={12}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button onClick={openAccountModal} type="button">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
}
