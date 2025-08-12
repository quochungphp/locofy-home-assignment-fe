import React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./style.css";
import { makeStyles } from '@mui/styles';

const pages = [
  {
    link: "#",
    label: "Solutions",
  },
  {
    link: "#",
    label: "Products",
  },
  {
    link: "#",
    label: "Partners",
  },
  {
    link: "#",
    label: "Resources",
  },
  {
    link: "figma-detect-file",
    label: "Figma Detect File Key",
    class: 'signin'
  },
  {
    link: "sign-in",
    label: "Sign In",
    class: 'signin'
  },
  {
    link: "sign-out",
    label: "Sign Out",
    class: 'signin'
  },
];
const useStyles = makeStyles(() => ({
  toolBar: {
    margin: "auto",
    maxWidth: 1024,
    width: "100%"
  },
}));
const Header = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" className="appHeader">
        <Toolbar className={classes.toolBar} >
          <Box
            component="img"
            sx={{
              height: 26,
              width: 90,
              marginRight: "100px"
            }}
            alt="Locofy"
            src="mainLogo.svg"
            
          />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }}}>
            {pages.map((page: any, index: number) => (
              <Button
                key={index}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link to={page.link} style={{color: "#fff" , textTransform: "capitalize" , textDecoration: "none"}} className={page.class}>{page.label}</Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
