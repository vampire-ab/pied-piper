import Huddle01 from "@/components/huddle01/Huddle01";
import { useHuddle01 } from "@huddle01/react";
import { useLobby } from "@huddle01/react/hooks";
import { GetStaticPaths, NextPage } from "next";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const meeting: NextPage = () => {
  const pathname = usePathname();
  const { initialize, isInitialized } = useHuddle01();
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  const [isDoc, setIsDoc] = useState<boolean>(false);
  const { joinLobby, isLobbyJoined } = useLobby();
  useEffect(() => {
    if (isInitialized === false)
      initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECTID || "");
    async function fetch() {
      try {
        const id: string[] = pathname?.split("/");

        setIsDoc(router?.query?.doctor === 'true');
        const joinee = id[2].split("?");
        console.log("Can Join Lobby? ", joinLobby.isCallable);
        if (isLobbyJoined == false && joinLobby.isCallable) {
          console.log("Joining lobby -> ", id[2]);
          await joinLobby(joinee[0]);
          setRoomId(joinee[0]);
        } else if (isLobbyJoined) setRoomId(joinee[0]);

      } catch (e) {
        console.log(e);
      }
    }
    if (pathname) {
      fetch();
    }
  }, [pathname]);
  useEffect(() => { }, []);
  return (
    <div className="h-[calc(100vh-100px)] w-screen">
      {isInitialized && isLobbyJoined && <Huddle01 roomId={roomId} isDoc={isDoc}></Huddle01>}
    </div>
  );
};
export default meeting;
