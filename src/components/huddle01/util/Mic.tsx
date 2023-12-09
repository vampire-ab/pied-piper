"use client";
import { useAudio, useEventListener, useRoom } from "@huddle01/react/hooks";
import { useEffect, useState } from "react";
import { BsMicMute, BsMic } from "react-icons/bs";

const Mic = () => {
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    isProducing,
    stream: micStream,
  } = useAudio();

  const { isRoomJoined } = useRoom();
  const [micOn, setMicOn] = useState<boolean>(false);
  const [disableMic, setDisableMic] = useState<boolean>(false);
  const [setter, setSetter] = useState<boolean>(false);
  async function toggleMic() {
    setDisableMic(true);
    if (micOn === false) {
      try {
        if (fetchAudioStream.isCallable) {
          await fetchAudioStream();
          setSetter(!setter);
        }
      } catch (e) {
        console.log(e);
      }
      setMicOn(true);
    } else {
      try {
        if (isProducing && stopProducingAudio.isCallable) {
          stopProducingAudio();
        }
        if (stopAudioStream.isCallable) {
          stopAudioStream();
        }
      } catch (e) {
        console.log(e);
      }
      setMicOn(false);
    }
    setDisableMic(false);
  }
  useEventListener("app:mic-on", async (audioStream: any) => {
    if (audioStream) await audioProduction(audioStream);
    setSetter(!setter);
  });
  async function audioProduction(audioStream: any) {
    console.log("Can Produce Audio? ", produceAudio.isCallable);
    if (produceAudio.isCallable) {
      await produceAudio(audioStream);
      console.log("Producing Audio: ", true);
    }
  }
  useEffect(() => {
    audioProduction(micStream);
  }, [setter]);
  return (
    <div>
      <div>
        <button
          className={
            "rounded-full px-3 py-3 w-fit " +
            (micOn
              ? "hover:bg-gray-400 hover:text-white"
              : "bg-red-600 text-white")
          }
          disabled={disableMic}
          onClick={() => toggleMic()}
        >
          {micOn ? <BsMic /> : <BsMicMute />}
        </button>
      </div>
    </div>
  );
};

export default Mic;
