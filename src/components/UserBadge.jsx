import React from "react";
import Avatar from "react-avatar";

const UserBadge = ({ username }) => {
  return (
    <div className="user-badge">
      <Avatar name={username} size={60} />
    </div>
  );
};

export default UserBadge;
