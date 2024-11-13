import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import GameImage from "../components/GameImage";
import CategoryButtons from "../components/CategoryButtons";

const MultiplayerGamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAI = location.state?.isAI || false; // Vérifie si l'utilisateur affronte une IA

  const categories = ["Panier", "Piano"];
  const [score, setScore] = useState({ player: 0, opponent: 0 });

  const handleChoice = (category: string) => {
    console.log(`Choix : ${category}`);
    const opponentChoice = categories[Math.floor(Math.random() * categories.length)];
    const isCorrect = category === "Panier"; // Exemple de vérification

    if (isAI) {
      if (isCorrect) {
        setScore({ ...score, player: score.player + 1 });
      } else {
        setScore({ ...score, opponent: score.opponent + 1 });
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Box display="flex" justifyContent="space-between" width="100%" px={3}>
        <Button variant="outlined" onClick={() => navigate("/menu")}>Quitter</Button>
        <Button variant="outlined">Pause</Button>
      </Box>
      <Typography variant="h5">
        {isAI ? "Affrontement contre l'IA" : "Affrontement contre un joueur"}
      </Typography>
      <GameImage />
      <CategoryButtons categories={categories} />
      <Typography variant="h6" mt={3}>
        Score: Vous {score.player} - {score.opponent} {isAI ? "IA" : "Adversaire"}
      </Typography>
    </Box>
  );
};

export default MultiplayerGamePage;
