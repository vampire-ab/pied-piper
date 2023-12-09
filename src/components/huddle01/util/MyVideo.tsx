"use client";
import { useEventListener, useRoom, useVideo } from "@huddle01/react/hooks";
import { useEffect, useRef, useState } from "react";
import { BsCameraVideoOff, BsCameraVideo } from "react-icons/bs";
type Props = {
  videoRef: any;
};
const MyVideo = ({ videoRef }: Props) => {
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    isProducing,
    stream: camStream,
  } = useVideo();
  const { isRoomJoined } = useRoom();
  const [camOn, setCamOn] = useState<boolean>(false);
  const [disableCam, setDisableCam] = useState<boolean>(false);
  const [setter, setSetter] = useState<boolean>(false);
  async function toggleCamera() {
    setDisableCam(true);
    if (camOn === false) {
      try {
        if (fetchVideoStream.isCallable) {
          console.log("Fetching Video");
          await fetchVideoStream();
        }
      } catch (e) {
        console.log(e);
      }
      setCamOn(true);
    } else {
      if (isProducing && stopProducingVideo.isCallable) {
        await stopProducingVideo();
      }
      if (stopVideoStream.isCallable) {
        await stopVideoStream();
      }
      setCamOn(false);
    }
    setDisableCam(false);
  }

  useEventListener("app:cam-on", async (videoStream) => {
    console.log("Is video stream available? ", Boolean(videoStream));
    if (videoStream && videoRef.current) {
      await (videoRef.current.srcObject = videoStream);
      setSetter(!setter);
    }
  });
  async function videoProduction(videoStream: any) {
    if (videoStream) {
      console.log("Can Produce Video? ", produceVideo.isCallable);
      if (produceVideo.isCallable) {
        await produceVideo(videoStream);
        setCamOn(true);
      }
    }
  }
  useEffect(() => {
    videoProduction(camStream);
  }, [setter]);
  return (
    <div>
      <div className="relative">
        {/* <video ref={videoRef} autoPlay muted className="rounded absolute " /> */}
        <button
          disabled={disableCam}
          className={
            "rounded-full px-3 py-3 w-fit " +
            (camOn
              ? "hover:bg-gray-400 hover:text-white"
              : "bg-red-600 text-white")
          }
          onClick={() => toggleCamera()}
        >
          {camOn ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </button>
      </div>
    </div>
  );
};

export default MyVideo;
