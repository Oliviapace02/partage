import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Vérification des informations d'inscription
    if (password === confirmPassword) {
      console.log(`Inscription de l'utilisateur : ${username}`);
      navigate("/");
    } else {
      alert("Les mots de passe ne correspondent pas");
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
      <TextField
        label="Confirmer le mot de passe"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained">S'inscrire</Button>
    </Box>
  );
};

export default RegisterForm;
