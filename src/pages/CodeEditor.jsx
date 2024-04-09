import React, { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import { initializeSocket } from "../socket";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UserBadge from "../components/UserBadge";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import ACTIONS from "../Actions";

const CodeEditor = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  console.log(roomId);

  console.log(location);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initializeSocket();
      console.log(socketRef);
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(err) {
        console.log("error", err);
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          console.log(clients);
          console.log(socketId, "socket id");
          setClients(clients);
          // Here you can update codeRef if necessary

          if (username !== location.state?.username) {
            toast.success(`${username}  joined the room`);
          }
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        console.log(socketId);
        console.log(username);
        toast.success(`${username} has left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    // Clean up function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [roomId, location.state?.username]); // Make sure to include dependencies in the dependency array

  const leaveRoom = () => {
    toast.loading("Leaving room");
    setTimeout(() => {
      navigate("/");
      toast.dismiss();
    }, 1000);
    navigate("/");
  };

  const handleSuccess = () => {
    toast.success("Room ID copied");
  };
  console.log(clients);

  console.log(roomId, "room id");
  return (
    <>
      <div className="editor-container">
        <div className="sidebar">
          <div className="sidebar-top">
            <h1>Collaborators</h1>
            <div className="collab-list">
              {clients?.map((client) => (
                <UserBadge key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>

          <div className="sidebar-bottom">
            <CopyToClipboard text={roomId} onCopy={handleSuccess}>
              <button className="btn copy-btn">Copy Room ID</button>
            </CopyToClipboard>
            <button className="btn leave-btn" onClick={leaveRoom}>
              Leave
            </button>
          </div>
        </div>
        <div className="code-editor-container">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
