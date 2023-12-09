import { useEventListener, usePeers } from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import { useEffect, useState } from "react";

const Peers = () => {
  const { peers } = usePeers();
  const [roomPeers, setRoomPeers] = useState<object>();
  useEffect(() => {}, [peers]);
  return (
    <div>
      <div className="grid grid-cols-4">
        {peers &&
          Object.values(peers)
            .filter((peer) => peer.mic)
            .map(
              (peer) =>
                peer.mic && (
                  <Audio
                    key={peer.peerId}
                    peerId={peer.peerId}
                    track={peer.mic}
                  />
                )
            )}
        {peers &&
          Object.values(peers)
            .filter((peer) => peer.cam)
            .map(
              (peer, idx) =>
                peer.cam && (
                  <div key={idx} className="px-4 pt-4 bg-gray-800 rounded">
                    <div className=" text-[0px] m-auto">
                      <Video
                      className="rounded"
                        key={peer.peerId}
                        peerId={peer.peerId}
                        track={peer.cam}
                        debug
                      />
                    </div>
                    <div className="bottom-2 right-2 text-xl text-[#F5F5F5]">{peer.displayName}</div>
                  </div>
                )
            )}
      </div>
    </div>
  );
};

export default Peers;
