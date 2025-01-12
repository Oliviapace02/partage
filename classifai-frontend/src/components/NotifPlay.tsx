import { Button } from "@mui/material";
import axios from "axios";
import { baseAPIURL } from "../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NotifPlayProps {
  opponentName: string;
  partyId: number;
}

const NotifPlay = ({ opponentName, partyId }: NotifPlayProps) => {
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
          key={partyId}
        >
          <h4>{opponentName} veut t'affronter</h4>
          <div>
            <Button
              style={{ color: "green" }}
              onClick={() => navigate(`/party/${partyId}`)}
            >
              Accepter
            </Button>
            <Button
              style={{ color: "red" }}
              onClick={() => {
                const client = axios.create({ baseURL: baseAPIURL });
                // const res = client.delete(`/partie/${partyId}`);
                setCanBeSee(false);
              }}
            >
              Refuser
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotifPlay;
