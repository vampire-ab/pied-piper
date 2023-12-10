import protobuf from "protobufjs";
import {
  createRelayNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
  createLightNode,
  bytesToUtf8,
  PageDirection,
  Protocols,
  IMessage,
  WakuNode,
  LightNode,
} from "@waku/sdk";

const contentTopic = `/guide-curse/1/chat/proto`;
const encoder = createEncoder({ contentTopic: contentTopic, ephemeral: true });
const decoder = createDecoder(contentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint32"))
  .add(new protobuf.Field("text", 2, "string"));

export async function setWakuRelayFunc() {
  const waku = await createRelayNode({ defaultBootstrap: true });
  await waku.start();
  await waitForRemotePeer(waku, [Protocols.Relay]);
  return waku;
}

export async function setWakuStoreFunc() {
  const waku = await createLightNode({ defaultBootstrap: true });
  await waku.start();
  console.log("Connecting to Waku Store...");
  await waitForRemotePeer(waku, [
    Protocols.LightPush,
    Protocols.Store,
    Protocols.Filter,
  ]);
  // // Create the callback function

  // // Create a filter subscription
  // const subscription = await waku.filter.createSubscription();

  // // Subscribe to content topics and process new messages
  // await subscription.subscribe([decoder], callback);
  return waku;
}

// export async function retrieveMsgs(
//   wakuStore: LightNode,
//   endTime: Date,
//   startTime: Date,
//   contentTopic: string
// ) {
//   try {
//     const queryOptions = {
//       timeFilter: {
//         startTime,
//         endTime,
//       },
//     };
//     console.log("Fetching msgs...");
//     const msgs: any = [];
//     const callback = (wakuMessage: IMessage) => {
//       // Render the message
//       const msg = decodeMessage(wakuMessage);
//       msgs.push(msg);
//     };
//     // Query the Store peer
//     await wakuStore.store.queryWithOrderedCallback(
//       [decoder],
//       callback,
//       queryOptions
//     );
//     console.log("msgs: ", msgs);
//     return { msgs: msgs };
//   } catch (e) {
//     console.log("Failed to retrieve messages", e);
//   }
// }

export function decodeMessage(wakuStoreMessage: IMessage) {
  if (!wakuStoreMessage.payload) return;
  const decodedMsg: any = SimpleChatMessage.decode(wakuStoreMessage.payload);
  const timestamp: number = decodedMsg.timestamp;
  const text: string = decodedMsg.text;
  if (!timestamp || !text) return;
  const time = new Date();
  time.setTime(Number(timestamp));
  return {
    text: text,
    timestamp: time,
    timestampInt: wakuStoreMessage.timestamp,
  };
}
