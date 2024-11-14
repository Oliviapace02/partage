import React, { useContext, useState } from "react";
import { Button, TextField, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import { baseAPIURL } from "../App";
import { Email, Save } from "@mui/icons-material";
import { ClassifaiContext } from "../context/classifai_context";
import { useNavigate } from "react-router-dom";

const ProfileView: React.FC = () => {
  const { user, setUser } = useContext(ClassifaiContext);
  const [email, setEmail] = useState(user?.email ?? "");
  const [motdepasse, setmotdepasse] = useState(user?.motdepasse ?? "");
  const [username, setusername] = useState(user?.username ?? "");

  return (
    <div>
      {user ? (
        <>
          <Toolbar>
            <Typography variant="h6">Profil de {user.username}</Typography>
          </Toolbar>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />

          <TextField
            label="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label="Nom"
            value={motdepasse}
            onChange={(e) => {
              setmotdepasse(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              axios.put(`${baseAPIURL}/users`, {
                username: username,
                email: email,
                motdepasse: motdepasse,
                scoreMax: user.scoreMax,
                id: user.id,
              });
              setUser({
                username: username,
                email: email,
                motdepasse: motdepasse,
                scoreMax: user.scoreMax,
                id: user.id,
              });
            }}
          >
            <Save />
          </Button>
        </>
      ) : (
        <div>Chargement du profil...</div>
      )}
    </div>
  );
};

export default ProfileView;
function setAnchorEl(arg0: null) {
  throw new Error("Function not implemented.");
}
