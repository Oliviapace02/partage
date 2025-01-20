import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { User } from "../models/user";
import { baseAPIURL } from "../App";
import { Alert, Button } from "@mui/material";
import { ClassifaiContext } from "../context/classifai_context";
import { useNavigate } from "react-router-dom";

// Définition des props pour le composant
interface AdversairePageProps {
  reload: number;
  iWantToReload: any;
}

const AdversairePage: React.FC<AdversairePageProps> = ({
  iWantToReload,
  reload,
}) => {
  const [users, setUsers] = useState<User[]>([]); // Stocker les utilisateurs
  const [selectedAdversary, setSelectedAdversary] = useState<User | null>(null); // Stocker l'adversaire sélectionné
  const [searchQuery, setSearchQuery] = useState<string>(""); // Stocker la valeur de la recherche
  const { user, setUser } = useContext(ClassifaiContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Charger tous les utilisateurs
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8000/users"); // L'URL de l'API pour obtenir les utilisateurs
        setUsers(response.data); // Mettre à jour l'état avec les utilisateurs récupérés
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      }
    }
    fetchUsers();
  }, []); // Le tableau vide [] signifie que l'effet s'exécutera une seule fois après le montage du composant

  // Fonction pour gérer la sélection d'un adversaire
  const handleSelectAdversary = (user: User) => {
    setSelectedAdversary(user); // Mettre à jour l'adversaire sélectionné
  };

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(
    (user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()) // Recherche insensible à la casse
  );

  const handleConfirmSelection = () => {
    if (selectedAdversary && user) {
      axios.post(`${baseAPIURL}/parties_a_deux`, {
        id_emetteur: user.id,
        id_receveur: selectedAdversary.id,
      });
      iWantToReload(reload + 1);
    } else {
      alert("Aucun adversaire sélectionné !");
    }
  };

  return (
    <div>
      <h1>Liste des adversaires</h1>

      {/* Barre de recherche */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Rechercher un adversaire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la valeur de recherche
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "300px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Liste des utilisateurs filtrés */}
      <ul>
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => handleSelectAdversary(user)} // Sélectionner l'adversaire en cliquant sur l'élément
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              padding: "5px",
              backgroundColor: "#f4f4f4",
              borderRadius: "5px",
            }}
          >
            <strong>{user.username}</strong> (ID: {user.id})
          </li>
        ))}
      </ul>

      {/* Affichage de l'adversaire sélectionné */}
      {selectedAdversary && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ccc",
            paddingTop: "10px",
          }}
        >
          <h2>Adversaire sélectionné</h2>
          <p>
            <strong>Nom :</strong> {selectedAdversary.username} <br />
            {/* <strong>ID :</strong> {selectedAdversary.id} */}
          </p>
        </div>
      )}

      {/* Bouton de confirmation */}
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={() => {
            handleConfirmSelection();
            navigate("/notifications");
          }}
        >
          Confirmer ma sélection
        </Button>
      </div>
    </div>
  );
};

export default AdversairePage;
