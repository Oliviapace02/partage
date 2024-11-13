import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseAPIURL } from "../App";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function handleCreateAccount(event: any) {
    event.preventDefault();
    try {
      const created = await axios.post(`${baseAPIURL}/users`, {
        username: username,
        motdepasse: password,
        email: email,
        scoreMax: 0,
      });

      console.log("Création réussie :", "poupoupou");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la création", error);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4">Inscription</Typography>
      <div>
        <TextField
          label="Nom d'utilisateur"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        label="email"
        variant="outlined"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleCreateAccount}>
        S'inscrire
      </Button>
      <Button onClick={() => navigate("/")}>Retour</Button>
    </Box>
  );
};

export default RegisterPage;
