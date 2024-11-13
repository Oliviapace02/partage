import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GameImage from "../components/GameImage";
import CategoryButtons from "../components/CategoryButtons";

const SoloGamePage: React.FC = () => {
  const navigate = useNavigate();
  const categories = ["Panier", "Piano"];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Box display="flex" justifyContent="space-between" width="100%" px={3}>
        <Button variant="outlined" onClick={() => navigate("/menu")}>Quitter</Button>
        <Button variant="outlined">Pause</Button>
      </Box>
      <GameImage />
      <CategoryButtons categories={categories} />
    </Box>
  );
};

export default SoloGamePage;
