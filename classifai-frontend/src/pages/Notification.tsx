import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseAPIURL } from "../App";
import NotifPlay from "../components/NotifPlay";
import { NotifChall } from "../models/notifchall";
import { NotifWin } from "../models/notifwin";
import NotifResult from "../components/NotifResult";

interface NotificationsChallProps {
  listNotifChall: NotifChall[];
  listNotifWin: NotifWin[];
  reload: number;
  iWantToReload: any;
}

const Notification: React.FC<NotificationsChallProps> = ({
  listNotifChall,
  listNotifWin,
  iWantToReload,
  reload,
}) => {
  useEffect(() => {
    iWantToReload(reload + 1);
  }, []);
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
            key={notifChallenge.partie_id}
            reload={reload}
            iWantToReload={iWantToReload}
          />
        );
      })}
      {listNotifWin.map((notifWin) => {
        return (
          <NotifResult
            opponentName={notifWin.username}
            notifId={notifWin.id}
            win={notifWin.gagnant}
            key={notifWin.id}
            reload={reload}
            iWantToReload={iWantToReload}
          />
        );
      })}
    </div>
  );
};

export default Notification;
