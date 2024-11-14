import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Information: React.FC = () => {
  const navigate = useNavigate(); // Déplacer useNavigate à l'intérieur du composant

  return (
    <div>
      <Button onClick={() => navigate("/menu")}>Retour</Button>
      <h1
        style={{
          color: "red", // Couleur du texte
          fontSize: "24px", // Taille de la police
          fontWeight: "bold", // Texte en gras
          textAlign: "center", // Alignement centré
        }}
      >
        "Vos autem, qui hunc nuntium legitis, animas vestras Diabolo
        vendidistis. Pactum vestra manu signatum est, et nunc tenebrae anima
        vestra circumdant. Omnia quae olim vestra erant, nunc in tenebris
        perdidistis; servitii aeterni estis damnati."
      </h1>
    </div>
  );
};

export default Information;
