import React from "react";
import axios from "axios";
import { Menu } from "@mui/icons-material";
import AdCircleIcon from "@mui/icons-material/AddCircle";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  CssBaseline,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useState } from "react";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SoloGamePage from "./pages/SoloGamePage";
import MultiplayerMenuPage from "./pages/MultiplayerMenuPage";
import MultiplayerGamePage from "./pages/MultiplayerGamePage";
import logo from "./logo.svg";
import "./App.css";
import { User } from "./models/user";
import { ClassifaiContext } from "./context/classifai_context";
export const baseAPIURL = "http://localhost:8000";

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <ClassifaiContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/solo" element={<SoloGamePage />} />
          <Route path="/multiplayer" element={<MultiplayerMenuPage />} />
          <Route path="/multiplayer/game" element={<MultiplayerGamePage />} />
        </Routes>
      </ClassifaiContext.Provider>
    </Router>
  );
}

export default App;
