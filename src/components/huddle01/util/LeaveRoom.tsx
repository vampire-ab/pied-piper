import { useRoom } from "@huddle01/react/hooks";
import Router from "next/router";
import { MdCallEnd } from "react-icons/md";
const LeaveRoom = () => {
  const { leaveRoom } = useRoom();
  return (
    <button
      className="rounded-full bg-red-600 px-3 py-3 w-fit"
      disabled={!leaveRoom.isCallable}
      onClick={() => {
        leaveRoom();
        Router.reload();
      }}
    >
      <MdCallEnd />
    </button>
  );
};

export default LeaveRoom;
