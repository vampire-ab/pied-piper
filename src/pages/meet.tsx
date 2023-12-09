import { useHuddle01 } from "@huddle01/react";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import { useEventListener, useLobby } from "@huddle01/react/hooks";
import Router from "next/router";
const meet: NextPage = () => {
  const [roomId, setRoomId] = useState<string>("");
  const {
    joinLobby,
    leaveLobby,
    isLoading,
    isLobbyJoined,
    error: lobbyError,
  } = useLobby();
  async function createAndJoinMeeting() {
    try {
      const response = await axios.post(
        "https://api.huddle01.com/api/v1/create-room",
        {
          title: "Meet Test",
          hostWallets: ["0xdD2a64ea2637b938F1E1C28D1dA9e443B28513f9"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_APIKEY||""
          },
        }
      );
      console.log(response);
      let room: string = response.data.data.roomId;
      if (joinLobby.isCallable) {
        joinLobby(room);
        setRoomId(room);
        Router.push({ pathname: `/meet/${room}` });
      } else {
        throw new Error("Lobby not found.");
      }
    } catch (e) {
      console.log(e);
    }
  }
  function joinMeeting() {
    // if (accessToken) joinLobby(roomId, accessToken);
    // else
    joinLobby(roomId);
    setRoomId(roomId);
    Router.push({ pathname: `/meet/${roomId}` });
  }
  useEventListener("lobby:joined", () => {
    console.log("lobby:joined");
  });
  const { initialize } = useHuddle01();
  useEffect(() => {
    initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECTID||"");
  }, []);
  return (
    <div>
      <div>
        <input
          className="bg-transparent text-gray-300 rounded-md px-3 py-1 border"
          type="text"
          onChange={(e) => setRoomId(e.target.value)}
        />
        {/* <input
          type="text"
          placeholder="Your Access Token (optional)"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rpnounded-lg text-sm focus:outline-none mr-2"
        /> */}
        <button
          disabled={!joinLobby.isCallable}
          onClick={() => joinMeeting()}
          className=""
        >
          Join
        </button>
        <button className="" onClick={() => createAndJoinMeeting()}>
          Create Meeting
        </button>
      </div>
    </div>
  );
};

export default meet;
