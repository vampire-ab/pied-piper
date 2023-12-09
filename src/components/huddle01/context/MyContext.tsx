import React, { createContext, useRef, useState } from "react";

type MyContextType = {
  peers: object;
  setPeers: React.Dispatch<React.SetStateAction<object>>;
};

const MyContext = createContext<MyContextType | null>(null);

type PeerContextProviderProps = {
  children: React.ReactNode;
};
export const PeerContextProvider = ({ children }: PeerContextProviderProps) => {
  const [peers, setPeers] = useState<object>({});
  const videoReff = useRef<HTMLVideoElement>(null);
  return (
    <MyContext.Provider value={{ peers, setPeers }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
