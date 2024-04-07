import React from "react";
import codeImg from "../assets/code.svg";

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="img-container">
          <img src={codeImg} alt="</>" className="code-img" />
        </div>
        <div className="form-container">
          <form action="">
            <div className="form-group">
              <label htmlFor="room_id">Room ID</label>
              <input type="text" className="input-field" />
            </div>

            <div className="form-group">
              <label htmlFor="room_id">Username</label>
              <input type="text" className="input-field" />
            </div>

            <button className="submit-btn btn">Submit</button>
            <p className="new-room-para">
              Don't have a Room ID?{" "}
              <span className="span-room">Create Room</span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
