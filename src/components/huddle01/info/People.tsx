import React from "react";
import { usePeers, useRoom } from "@huddle01/react/hooks";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  setShowPeople: (val: boolean) => void;
};
const People = ({ setShowPeople }: Props) => {
  const { peers } = usePeers();
  const { isRoomJoined } = useRoom();
  // console.log("Peers: ", peers);
  return (
    <div>
      <button onClick={() => setShowPeople(false)}>
        <AiOutlineClose />
      </button>
      <div className="flex-col gap-10">
        <div>
          Participants ({Object.values(peers).length + (isRoomJoined ? 1 : 0)})
        </div>
        {peers &&
          Object.values(peers).map((peer, idx) => {
            return (
              <div key={idx} className="rounded p-2 text-center">
                {peer.displayName}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default People;
