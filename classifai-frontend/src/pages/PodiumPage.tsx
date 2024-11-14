import React, { useContext, useEffect, useState } from "react";

import { User } from "../models/user";

interface PodiumPageProps {
  rank: User[];
}
const PodiumPage: React.FC<PodiumPageProps> = ({ rank }) => {
  return (
    <div
      style={{
        width: 500,

        maxHeight: 500,
        overflowY: "auto",
      }}
    >
      {rank.map((user: User) => {
        return (
          <div
            style={{
              marginLeft: 50,
              marginRight: 50,
              display: "flex",

              justifyContent: "space-between",
            }}
            key={user.id}
          >
            <h2>{user.username}</h2>
            <h2>{user.scoreMax}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default PodiumPage;
