type Props = {
  videoRef: any;
};
const SubVideo = ({ videoRef }: Props) => {
  return (
    <div className="absolute right-10 bottom-10 rounded-lg w-[200px] h-[150px] bg-gray-800">
      <video
        draggable
        ref={videoRef}
        autoPlay
        muted
        className="rounded-lg w-full h-full"
      />
    </div>
  );
};

export default SubVideo;
