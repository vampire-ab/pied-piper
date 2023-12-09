import { useRoom } from "@huddle01/react/hooks";
import { MdCall } from "react-icons/md";

const JoinRoom = () => {
  const { joinRoom } = useRoom();
  return (
    <button
      disabled={!joinRoom.isCallable}
      onClick={joinRoom}
      className="rounded-full bg-green-600 px-3 py-3 w-fit"
    >
      <MdCall />
    </button>
  );
};

export default JoinRoom;
