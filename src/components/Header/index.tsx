// Header.tsx
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { makeStyles } from "@mui/styles";
import { serverApi } from "../../resources/server-api"; // Import your serverApi

const pages = [
  { id: "solutions", link: "#", label: "Solutions" },
  { id: "products", link: "#", label: "Products" },
  { id: "partners", link: "#", label: "Partners" },
  { id: "resources", link: "#", label: "Resources" },
  { id: "figma_detect_file_key", link: "figma-detect-file", label: "Figma Detect File Key" },
  { id: "sign_in", link: "sign-in", label: "Sign In", authRequired: false },
  { id: "sign_up", link: "sign-up", label: "Sign Up", authRequired: false },
  { id: "sign_out", link: "sign-out", label: "Sign Out", authRequired: true },
];

const useStyles = makeStyles(() => ({
  toolBar: {
    margin: "auto",
    maxWidth: 1024,
    width: "100%",
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(serverApi.getAccessToken() || null);

  // Sync access token changes from other parts of the app
  useEffect(() => {
    const handleStorageChange = () => {
      setAccessToken(serverApi.getAccessToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignOut = () => {
    serverApi.clearTokens();
    setAccessToken(null); // Update state so menu refreshes
    navigate("/sign-in");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" className="appHeader">
        <Toolbar className={classes.toolBar}>
          <Box
            component="img"
            sx={{ height: 26, width: 90, marginRight: "100px", cursor: "pointer" }}
            alt="Locofy"
            src="mainLogo.svg"
            onClick={() => navigate("/")}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => {
              // Hide Sign In & Sign Up when logged in
              if ((page.id === "sign_in" || page.id === "sign_up") && accessToken) return null;
              // Hide Sign Out when not logged in
              if (page.id === "sign_out" && !accessToken) return null;

              return (
                <Button
                  key={index}
                  sx={{ my: 2, color: "white", display: "block" }}
                  onClick={page.id === "sign_out" ? handleSignOut : undefined}
                >
                  <Link
                    to={page.link}
                    style={{
                      color: "#fff",
                      textTransform: "capitalize",
                      textDecoration: "none"
                    }}
                  >
                    {page.label}
                  </Link>
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
