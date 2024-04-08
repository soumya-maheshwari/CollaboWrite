import React from "react";

const UserBadge = ({ username }) => {
  const firstLetter = username?.charAt(0).toUpperCase();

  return (
    <div className="user-badge">
      <div className="circle">{firstLetter}</div>

      <div className="name">{username}</div>
    </div>
  );
};

export default UserBadge;
