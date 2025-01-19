import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import Notification from "./pages/Notification";
import LoginPage from "./pages/LoginPage";
import Information from "./pages/information";

import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SoloGamePage from "./pages/SoloGamePage";
import MultiplayerMenuPage from "./pages/MultiplayerMenuPage";
import "./App.css";
import { User } from "./models/user";
import { ClassifaiContext } from "./context/classifai_context";
import MenuBar from "./components/MenuBar";
import Profile from "./components/Profile";
import axios from "axios";
import PodiumPage from "./pages/PodiumPage";
import { NotifWin } from "./models/notifwin";
import { NotifChall } from "./models/notifchall";
export const baseAPIURL = "http://localhost:8000";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rank, setRank] = useState<User[]>([]);
  const [notifWin, setNotifWin] = useState<NotifWin[]>([]);
  const [notifChall, setNotifChall] = useState<NotifChall[]>([]);

  useEffect(() => {
    async function getRanking() {
      const request = await axios.get(`${baseAPIURL}/podium`);
      const values = request.data;
      setRank(values);
    }
    getRanking();
  }, []);
  useEffect(() => {
    async function getNotifs() {
      if (user !== null) {
        const request = await axios.get(`${baseAPIURL}/Notifs/${user.id}`);
        const values = request.data;
        setNotifWin(values[0]);
        setNotifChall(values[1]);
      }
    }
    getNotifs();
  }, [user]);
  return (
    <Router>
      <ClassifaiContext.Provider value={{ user, setUser }}>
        <MenuBar />

        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/party/:partyId" element={<Profile />} />

          <Route path="/" element={<LoginPage />} />
          <Route path="/information" element={<Information />} />
          <Route
            path="/notifications"
            element={
              <Notification
                listNotifChall={notifChall}
                listNotifWin={notifWin}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/solo" element={<SoloGamePage />} />
          <Route path="/podium" element={<PodiumPage rank={rank} />} />
          <Route path="/multiplayer" element={<MultiplayerMenuPage />} />
        </Routes>
      </ClassifaiContext.Provider>
    </Router>
  );
}

export default App;
