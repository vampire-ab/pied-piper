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
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import People from "./info/People";
import SubVideo from "./util/SubVideo";
import Powerloom from "../Powerloom";
type Props = {
  roomId: string;
  isDoc: boolean;
};
const date = new Date();
const Huddle01 = ({ roomId, isDoc }: Props) => {
  // const [accessToken, setAccessToken] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isRoomJoined } = useRoom();
  const { isLobbyJoined } = useLobby();
  const [showPeople, setShowPeople] = useState<boolean>(true);
  useEffect(() => { }, [videoRef]);
  return (
    <div className="w-full h-full pb-10 flex flex-col">
      <div className="w-full h-full flex flex-1 px-3">
        <div className="relative flex-1 px-5">
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
          <div className="w-[700px] h-full ">
            <Powerloom />
          </div>
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
