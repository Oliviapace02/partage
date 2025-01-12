import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { baseAPIURL } from "../App";
import NotifPlay from "../components/NotifPlay";

const Notification: React.FC = () => {
  const listNotif = [
    { opponentName: "toto", partyId: 1 },
    { opponentName: "MArtin", partyId: 12 },
    { opponentName: "titin", partyId: 11 },
    { opponentName: "shopy", partyId: 123 },
    { opponentName: "grappu", partyId: 13 },
    { opponentName: "touta", partyId: 16 },
  ];
  return (
    <div
      style={{
        width: 700,

        maxHeight: 800,
        overflowY: "auto",
      }}
    >
      {listNotif.map((notifChallenge) => {
        return (
          <NotifPlay
            opponentName={notifChallenge.opponentName}
            partyId={notifChallenge.partyId}
          />
        );
      })}
    </div>
  );
};

export default Notification;
