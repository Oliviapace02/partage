import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { baseAPIURL } from "../App";
import NotifPlay from "../components/NotifPlay";
import { NotifChall } from "../models/notifchall";
import { NotifWin } from "../models/notifwin";
import NotifResult from "../components/NotifResult";

interface NotificationsChallProps {
  listNotifChall: NotifChall[];
  listNotifWin: NotifWin[];
}

const Notification: React.FC<NotificationsChallProps> = ({
  listNotifChall,
  listNotifWin,
}) => {
  return (
    <div
      style={{
        width: 700,

        maxHeight: 800,
        overflowY: "auto",
      }}
    >
      {listNotifChall.map((notifChallenge) => {
        return (
          <NotifPlay
            opponentName={notifChallenge.username}
            partyId={notifChallenge.partie_id}
          />
        );
      })}
      {listNotifWin.map((notifWin) => {
        return (
          <NotifResult
            opponentName={notifWin.username}
            notifId={notifWin.id}
            win={notifWin.gagnant}
          />
        );
      })}
    </div>
  );
};

export default Notification;
