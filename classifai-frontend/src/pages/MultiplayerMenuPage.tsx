import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MultiplayerMenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4">Mode Multijoueur</Typography>
      <Button variant="contained" onClick={() => navigate("/multiplayer/game")}>Choisir un adversaire</Button>
      <Button variant="contained" onClick={() => navigate("/multiplayer/game")}>Affronter l'IA</Button>
    </Box>
  );
};

export default MultiplayerMenuPage;
