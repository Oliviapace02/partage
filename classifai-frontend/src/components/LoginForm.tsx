import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de vérification des informations de connexion (à implémenter)
    if (username && password) {
      console.log(`Connexion de l'utilisateur : ${username}`);
      navigate("/menu");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="center">
      <TextField
        label="Nom d'utilisateur"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained">Se connecter</Button>
    </Box>
  );
};

export default LoginForm;
