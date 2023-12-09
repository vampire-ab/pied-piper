import { NextRequest } from "next/server";
import Bundlr from "@bundlr-network/client";
import { NextApiResponse } from "next";

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

type Data = {
  url: string;
};

export default async function handler(
  req: NextRequest,
  res: NextApiResponse<Data>
) {
  // console.log("here: data: ", req.body);
  const data = req.body;
  const bundlr = new Bundlr("http://devnet.bundlr.network", "matic", process.env.NEXT_PUBLIC_BNDLR_KEY, {
		providerUrl: "https://rpc-mumbai.maticvigil.com",
	});
  await bundlr.ready();
  let balance = await bundlr.getLoadedBalance();
  let readableBalance = bundlr.utils.fromAtomic(balance).toNumber();

  if (readableBalance < MIN_FUNDS) {
    await bundlr.fund(TOP_UP);
  }

  const tx = await bundlr.upload(JSON.stringify(data), {
    tags: [{ name: "Content-Type", value: "application/json" }],
  });

  return res.json({ url: `https://arweave.net/${tx.id}` });
}
