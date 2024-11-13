import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4">Menu Principal</Typography>
      <Button variant="contained" onClick={() => navigate("/solo")}>Mode Solo</Button>
      <Button variant="contained" onClick={() => navigate("/multiplayer")}>Mode Multijoueur</Button>
    </Box>
  );
};

export default MenuPage;
