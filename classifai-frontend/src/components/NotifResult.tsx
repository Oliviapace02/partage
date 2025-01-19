import { Button } from "@mui/material";
import axios from "axios";
import { baseAPIURL } from "../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NotifPlayProps {
  opponentName: string;
  notifId: number;
  win: boolean;
}

const NotifResult = ({ opponentName, notifId, win }: NotifPlayProps) => {
  const [canBeSee, setCanBeSee] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      {canBeSee && (
        <div
          style={{
            marginLeft: 50,
            marginRight: 50,
            display: "flex",

            justifyContent: "space-between",
          }}
          key={notifId}
        >
          {win ? (
            <h4>Félicitation! Tu as battu {opponentName}</h4>
          ) : (
            <h4>Dommage! {opponentName} t'as battu</h4>
          )}
          <div>
            <Button
              style={{ color: "red" }}
              onClick={() => {
                const client = axios.create({ baseURL: baseAPIURL });
                // const res = client.delete(`/partie/${notifId}`);
                setCanBeSee(false);
                axios.delete(`${baseAPIURL}/Notifs/${notifId}`);
              }}
            >
              Supprimer la Notification
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotifResult;
