import React, { useContext } from "react";
import { Button, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import { ClassifaiContext } from "../context/classifai_context";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Home, Login } from "@mui/icons-material";
import { PermDeviceInformation } from "@mui/icons-material";
import { EmojiEvents } from "@mui/icons-material";
import { Notifications } from "@mui/icons-material";
import LoginPage from "../pages/LoginPage";

const MenuBar: React.FC = () => {
  const { user, setUser } = useContext(ClassifaiContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    navigate("/");
    handleClose();
  };

  return (
    <Toolbar>
      <Button onClick={() => navigate(user ? "/menu" : "/")}>
        <Home />
      </Button>
      <Button component={Link} to="/podium">
        <EmojiEvents />
      </Button>

      <Button component={Link} to="/information">
        <PermDeviceInformation />
      </Button>

      {user ? (
        <>
          <Button component={Link} to="/notification">
            <Notifications />
          </Button>

          {/* <Button component={Link} to="/">
            déconnexion ?
          </Button>

          <Button component={Link} to="/profile">
            <Home />
          </Button> */}

          <Button onClick={handleMenuClick}>{user.username}</Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              component={Link}
              to={`/profile/${user.id}`}
              onClick={handleClose}
            >
              Mon Profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
        </>
      ) : (
        <Button component={Link} to="/login"></Button>
      )}
    </Toolbar>
  );
};

export default MenuBar;
