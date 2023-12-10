import React, { useState, useRef, useEffect } from "react";
/* Uncomment to see the Xstate Inspector */
// import { Inspect } from '@huddle01/react/components';
import {
  useEventListener,
  useLobby,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";
import Room from "./Room";
import MyVideo from "./util/MyVideo";
import JoinRoom from "./util/JoinRoom";
import Mic from "./util/Mic";
import LeaveRoom from "./util/LeaveRoom";

import protobuf from "protobufjs";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import People from "./info/People";
import SubVideo from "./util/SubVideo";
import Powerloom from "../Powerloom";
import { decodeMessage, setWakuStoreFunc } from "@/tools/waku/handle";
import { IMessage, LightNode, createDecoder, createEncoder } from "@waku/sdk";
import { ISimpleChatMessage } from "@/utils/interfaces";
type Props = {
  roomId: string;
  isDoc: boolean;
};
const contentTopic = `/guide-curse/1/chat/proto`;
const encoder = createEncoder({ contentTopic: contentTopic });
const decoder = createDecoder(contentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint32"))
  .add(new protobuf.Field("text", 2, "string"));
const date = new Date();
const Huddle01 = ({ roomId, isDoc }: Props) => {
  // const [accessToken, setAccessToken] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isRoomJoined } = useRoom();
  const { isLobbyJoined } = useLobby();
  const [showPeople, setShowPeople] = useState<boolean>(true);
  const [messages, setMessages] = React.useState<Array<ISimpleChatMessage>>([]);
  const [wakuStore, setWakuStore] = React.useState<LightNode | undefined>(undefined);
  const [wakuStoreStatus, setWakuStoreStatus] = React.useState<string>("None");
  const [avg, setAvg] = React.useState<any>({});

  const [chartData, setChartData] = React.useState<any>({});
  React.useEffect(() => {
    if (wakuStoreStatus === "None") {
      // Connect to store and filter node.
      (async () => {
        setWakuStoreStatus("Starting");
        setWakuStore(await setWakuStoreFunc());
        setWakuStoreStatus("Connected");
      })();
    }

    if (wakuStoreStatus === "Connected" && wakuStore) {
      if (isDoc) {
        (async () => {
          await wakuStore.filter.subscribe(decoder, (wakuMessage: IMessage) => {
            if (!wakuMessage.payload) return;
            const message: ISimpleChatMessage | undefined = decodeMessage(wakuMessage);
            if (!message) return;
            // const arrayedMsg: ISimpleChatMessage[] = [message];
            // const allMessages: Array<ISimpleChatMessage> = arrayedMsg.concat(messages);
            const chartData: any = [];
            chartData.push(message);
            if (chartData.length > 5) chartData.shift();
            setMessages(
              chartData
            );
            console.log(message);
          });
          console.log("Connected to waku");

        })();
      }
      else {

        setInterval(async () => {
          const date = new Date();
          const time = date.getTime();

          const num = Math.floor((Math.floor(Math.random()) + 30) * 3);
          const protoMsg = SimpleChatMessage.create({
            timestamp: time,
            text: String(Math.floor(num)),
          });
          const payload = SimpleChatMessage.encode(protoMsg).finish();
          const msgTime = new Date();

          msgTime.setTime(time);
          console.log("Current Heart Rate: ", num);
          if (num) {
            try {

              await wakuStore.lightPush.send(encoder, {
                payload,
              });
              console.log("Sent to waku");
            } catch (e) {
              console.log(e);
            }
          }
        }, 4000)
      }
    }
  }, [wakuStore, wakuStoreStatus]);
  useEffect(() => { }, [videoRef]);
  return (
    <div className="w-full h-full pb-10 flex flex-col">
      <div className="w-full h-full flex flex-1 px-3">
        <div className="relative flex gap-2 flex-wrap flex-1 px-5">
          {isRoomJoined ? (
            <Room />
          ) : (
            <div className="w-fit h-fit m-auto ">
              Click on{" "}
              <span className="text-sm">
                <JoinRoom />
              </span>{" "}
              to join the meet and view other participants
            </div>
          )}
          <Powerloom />

          <SubVideo videoRef={videoRef} />
        </div>
        {/**Sidebar  */}
        {showPeople && (
          <div className="ml-auto sidebar w-[20%]">
            <People setShowPeople={setShowPeople} />
          </div>
        )}
      </div>
      <div className="justify-between items-center w-full py-2 px-5 flex">
        {/** Start Elements */}
        <div className="tracking-widest text-lg">
          {date.getHours()} : {date.getMinutes()} | {roomId}
          <div></div>
        </div>
        {/** Center Elements */}
        <div className="gap-10 flex">
          <div className="">
            <Mic />
          </div>
          <div className="">
            <MyVideo videoRef={videoRef} />
          </div>
          {isRoomJoined ? (
            <div className="">
              <LeaveRoom />
            </div>
          ) : (
            <div className="animate-bounce">
              <JoinRoom />
            </div>
          )}
        </div>
        {/**End Elements */}
        <div className="flex w-[20%]">
          <button
            className="flex text-xl font-bold items-center"
            onClick={() => setShowPeople(!showPeople)}
          >
            {showPeople ? <BsPeopleFill /> : <BsPeople />}
          </button>
        </div>
      </div>

      {/* Uncomment to see the Xstate Inspector */}
      {/* <Inspect /> */}
    </div>
  );
};

export default Huddle01;
