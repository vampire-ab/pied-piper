import React from "react";
import { loadKeyPairFromStorage } from "./key_pair_storage";
import { KeyPair } from "@/tools/waku/crypto";

export interface Props {
    setEncryptionKeyPair: (keyPair: KeyPair) => void;
    disabled: boolean;
    password: string | undefined;
}

export function LoadKeyPair({
    password,
    disabled,
    setEncryptionKeyPair,
}: Props) {
    const loadKeyPair = () => {
        if (disabled) return;
        if (!password) return;
        loadKeyPairFromStorage(password).then((keyPair: KeyPair | undefined) => {
            if (!keyPair) return;
            console.log("Encryption KeyPair loaded from storage");
            setEncryptionKeyPair(keyPair);
        });
    };

    return (
        <button
            onClick={loadKeyPair}
            disabled={!password || disabled}
        >
            Load Encryption Key Pair from storage
        </button>
    );
}