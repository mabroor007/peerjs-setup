import Peer from "peerjs";
import { v4 as uuid } from "uuid";

export interface Streams {
  local: MediaStream;
  remote: MediaStream;
}

const getMedia = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};

export const useApp = () => {
  const peer = new Peer(uuid(), { host: "localhost", port: 3001 });

  const onCall = (fn: (streams: Streams) => void) => {
    peer.on("call", async (call) => {
      const localStream = await getMedia();
      call.answer(localStream);
      call.on("stream", (remoteStream) => {
        fn({ local: localStream, remote: remoteStream });
      });
    });
  };

  const makeCall = async (callerId: string, fn: (streams: Streams) => void) => {
    const localStream = await getMedia();
    const call = peer.call(callerId, localStream);

    call.on("stream", (remoteStream) => {
      fn({ local: localStream, remote: remoteStream });
    });
  };

  return { id: peer.id, onCall, makeCall };
};
