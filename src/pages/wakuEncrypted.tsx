import React, { useEffect, useState } from "react";
import type { RelayNode, IDecoder } from "@waku/interfaces";
import { createDecoder as createSymmetricDecoder } from "@waku/message-encryption/symmetric";
import { createDecoder, DecodedMessage } from "@waku/message-encryption/ecies";
import { KeyPair, PublicKeyMessageEncryptionKey } from "@/tools/waku/crypto";
import { Message } from "@/tools/waku/messaging/Messages";
import KeyPairHandling from "@/components/waku/KeyPairHandling/KeyPairHandling";

import Messaging from "@/components/waku/messaging/Messaging";
import {
  PrivateMessageContentTopic,
  handlePrivateMessage,
  handlePublicKeyMessage,
  initWaku,
  PublicKeyContentTopic,
} from "@/tools/waku/waku";
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider";
import BroadcastPublicKey from "@/components/waku/BroadCastPublicKey";
import ConnectWallet from "@/components/waku/ConnectButton";


function App() {
  const [waku, setWaku] = useState<RelayNode>();
  const [provider, setProvider] = useState<Web3Provider>();
  const [encryptionKeyPair, setEncryptionKeyPair] = useState<
    KeyPair | undefined
  >();
  const [privateMessageDecoder, setPrivateMessageDecoder] =
    useState<IDecoder<DecodedMessage>>();
  const [publicKeys, setPublicKeys] = useState<Map<string, Uint8Array>>(
    new Map()
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [address, setAddress] = useState<string>();
  const [peerStats, setPeerStats] = useState<{
    relayPeers: number;
  }>({
    relayPeers: 0,
  });


  // Waku initialization
  useEffect(() => {
    (async () => {
      if (waku) return;

      const _waku = await initWaku();
      console.log("waku: ready");
      setWaku(_waku);
    })().catch((e) => {
      console.error("Failed to initiate Waku", e);
    });
  }, [waku]);

  useEffect(() => {
    if (!waku) return;

    const observerPublicKeyMessage = handlePublicKeyMessage.bind(
      {},
      address,
      setPublicKeys
    );

    const publicKeyMessageDecoder = createSymmetricDecoder(
      PublicKeyContentTopic,
      PublicKeyMessageEncryptionKey
    );

    let unsubscribe: undefined | (() => Promise<void>);

    waku.relay.subscribe(publicKeyMessageDecoder, observerPublicKeyMessage);

    return function cleanUp() {
      if (typeof unsubscribe === "undefined") return;

      unsubscribe().then(
        () => {
          console.log("unsubscribed to ", PublicKeyContentTopic);
        },
        (e) => console.error("Failed to unsubscribe", e)
      );
    };
  }, [waku, address]);

  useEffect(() => {
    if (!encryptionKeyPair) return;

    setPrivateMessageDecoder(
      createDecoder(PrivateMessageContentTopic, encryptionKeyPair.privateKey)
    );
  }, [encryptionKeyPair]);

  useEffect(() => {
    if (!waku) return;
    if (!privateMessageDecoder) return;
    if (!address) return;

    const observerPrivateMessage = handlePrivateMessage.bind(
      {},
      setMessages,
      address
    );

    let unsubscribe: undefined | (() => Promise<void>);

    waku.relay.subscribe(privateMessageDecoder, observerPrivateMessage);

    return function cleanUp() {
      if (typeof unsubscribe === "undefined") return;
      unsubscribe().catch((e) => console.error("Failed to unsubscribe", e));
    };
  }, [waku, address, privateMessageDecoder]);

  useEffect(() => {
    if (!waku) return;

    const interval = setInterval(async () => {
      const peers = waku.relay.gossipSub.getPeers();

      setPeerStats({
        relayPeers: peers.length,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [waku]);

  let addressDisplay = "";
  if (address) {
    addressDisplay =
      address.substr(0, 6) + "..." + address.substr(address.length - 4, 4);
  }

  return (
    <div >


      <div >
        <main >
          <fieldset>
            <legend>Wallet</legend>
            <ConnectWallet
              setAddress={setAddress}
              setProvider={setProvider}
            />
          </fieldset>
          <fieldset>
            <legend>Encryption Key Pair</legend>
            <KeyPairHandling
              encryptionKeyPair={encryptionKeyPair}
              setEncryptionKeyPair={setEncryptionKeyPair}
            />
            <BroadcastPublicKey
              address={address}
              encryptionKeyPair={encryptionKeyPair}
              waku={waku}
              signer={provider?.getSigner()}
            />
          </fieldset>
          <fieldset>
            <legend>Messaging</legend>
            <Messaging
              recipients={publicKeys}
              waku={waku}
              messages={messages}
            />
          </fieldset>
        </main>
      </div>
    </div>
  );
}

export default App;