import React, { useEffect, useState } from "react";
import codeImg from "../assets/code.svg";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [uuid, setuuid] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateID = () => {
    const id = uuidv4();
    setuuid(id);
    console.log(uuid, "uuid");
  };

  useEffect(() => {
    if (!uuid) {
      document.getElementById("uuid").style.display = "block";
    } else {
      document.getElementById("uuid").style.display = "none";
    }
    if (!username) {
      document.getElementById("username").style.display = "block";
    } else {
      document.getElementById("username").style.display = "none";
    }
  }, [uuid, username]);

  const submit = () => {
    if (!uuid || !username) {
      return;
    } else {
      navigate(`/editor/${uuid}`);
    }
  };
  return (
    <>
      <div className="home-container">
        <div className="img-container">
          <img src={codeImg} alt="</>" className="code-img" />
        </div>
        <div className="form-container">
          <form action="" onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="room_id">Room ID</label>
              <input
                type="text"
                className="input-field"
                value={uuid}
                onChange={(e) => setuuid(e.target.value)}
              />
              <p className="error" id="uuid">
                Room ID is required
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="room_id">Username</label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="error" id="username">
                Username is required
              </p>
            </div>

            <button className="submit-btn btn">Submit</button>
            <p className="new-room-para">
              Don't have a Room ID?{" "}
              <span className="span-room" onClick={generateID}>
                Create Room
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
