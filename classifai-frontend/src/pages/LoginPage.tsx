import React, { useContext, useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseAPIURL } from "../App";
import { classicNameResolver } from "typescript";
import { ClassifaiContext } from "../context/classifai_context";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(ClassifaiContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: any) {
    event.preventDefault();
    try {
      if (username !== "" && password !== "") {
        const response = await axios.get(`${baseAPIURL}/users/${username}`); // Vérifie si c'est bien un GET
        console.log(response.data);
        if (password === response.data.motdepasse) {
          console.log("Connexion réussie :", response.data);
          setUser(response.data);
          navigate("/menu");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4">Connexion</Typography>
      <TextField
        label="Nom d'utilisateur"
        variant="outlined"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="outlined" onClick={handleLogin}>
        Se connecter{""}
      </Button>
      <Button onClick={() => navigate("/register")}>S'inscrire</Button>
    </Box>
  );
};

export default LoginPage;
