import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { goerli, polygonMumbai } from "viem/chains";

const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_ACCOUNT}`);
export const privSigner = createWalletClient({
  account,
  chain: goerli,
  transport: http(),
});

export const client = createPublicClient({
  chain: polygonMumbai,
  transport: http(),
});

