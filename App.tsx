import React, { useEffect, useRef, useState } from "react";
import { useApp, Streams } from "./useApp";

function App() {
  const [userId, setUserId] = useState("");
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const { id, onCall, makeCall } = useApp();

  const handleCall = (streams: Streams) => {
    setStreams(streams);
  };

  const setStreams = (streams: Streams) => {
    if (localRef.current) {
      localRef.current.srcObject = streams.local;
    }
    if (remoteRef.current) {
      remoteRef.current.srcObject = streams.remote;
    }
  };

  useEffect(() => {
    onCall(handleCall);
  }, []);

  const handleMakeCall = () => {
    makeCall(userId, (streams) => {
      setStreams(streams);
    });
  };

  return (
    <div className="App">
      <h3>My number</h3>
      <h4>{id}</h4>
      <hr />
      <video ref={localRef} autoPlay muted></video>
      <video ref={remoteRef} autoPlay muted></video>
      <hr />
      <input
        value={userId}
        onChange={(e) => {
          setUserId(e.target.value);
        }}
      />
      <button onClick={handleMakeCall}>Call</button>
    </div>
  );
}

export default App;
