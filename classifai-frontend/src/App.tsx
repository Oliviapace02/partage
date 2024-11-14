import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";

import LoginPage from "./pages/LoginPage";
import Information from "./pages/information";

import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SoloGamePage from "./pages/SoloGamePage";
import MultiplayerMenuPage from "./pages/MultiplayerMenuPage";
import MultiplayerGamePage from "./pages/MultiplayerGamePage";
import "./App.css";
import { User } from "./models/user";
import { ClassifaiContext } from "./context/classifai_context";
import MenuBar from "./components/MenuBar";
import Profile from "./components/Profile";
import axios from "axios";
import PodiumPage from "./pages/PodiumPage";
export const baseAPIURL = "http://localhost:8000";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rank, setRank] = useState<User[]>([]);
  useEffect(() => {
    async function getRanking() {
      const request = await axios.get(`${baseAPIURL}/podium`);
      const values = request.data;
      setRank(values);
    }
    getRanking();
  }, []);

  return (
    <Router>
      <ClassifaiContext.Provider value={{ user, setUser }}>
        <MenuBar />

        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/information" element={<Information />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/solo" element={<SoloGamePage />} />
          <Route path="/podium" element={<PodiumPage rank={rank} />} />
          <Route path="/multiplayer" element={<MultiplayerMenuPage />} />
          <Route path="/multiplayer/game" element={<MultiplayerGamePage />} />
        </Routes>
      </ClassifaiContext.Provider>
    </Router>
  );
}

export default App;
