import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { UserSignUpPayloadDto, ErrorResponse } from "../../domain";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Divider, List, ListItem, ListItemText } from "@mui/material";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from "react";
import { validateEmail } from "../../utils/isEmail";
import { postSignUp } from "../../reduxStore/signup-request/action";
import { userSignUpSelector } from "../../reduxStore/signup-request/sliceReducer";

export const SignUp = () => {
  const dispatch = useDispatch();
  const initialState = useSelector(userSignUpSelector);
  const [errorEmail, setErrorEmail] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userState, setUserState] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: 0
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUserState(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === "email" && !validateEmail(value)) {
      setErrorEmail("Email is invalid");
    } else {
      setErrorEmail('');
    }
  };

  const [errors, setErrors] = React.useState<ErrorResponse[]>();
  const [status, setStatus] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(postSignUp(userState as unknown as UserSignUpPayloadDto));
  };

  React.useEffect(() => {
    if (initialState.data.status) {
      setErrors(initialState.data.errors);
      setStatus(initialState.data.status);
    }
  }, [initialState]);

  React.useEffect(() => {
    if (initialState.data.status === 'success') {
      window.location.href = '/sign-in';
    }
  }, [initialState]);

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        padding: "40px 30px",
        borderRadius: "20px",
        marginTop: "60px",
        backgroundColor: "white",
        boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CssBaseline />
      <Grid container>
        <Grid item xs={6}>
          <Box sx={{ marginTop: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
              component="img"
              alt="Locofy"
              src="mainLogo.svg"
              sx={{
                width: 120,
                height: "auto",
                backgroundColor: "#8a2be2",
                padding: "5px",
                marginBottom: 2,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>
          <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>But Why Jotai?</Typography>
            <Typography variant="body1" gutterBottom>
              Using Jotai may not be the right choice for every developer solely based on its ease of use...
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>1. Easy to Use and Learn</Typography>
            <Typography variant="body1" gutterBottom>
              Jotai offers a slightly different approach — if you are familiar with <code>useState</code> you can pick it up quickly.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>2. Less Boilerplate Code</Typography>
            <Typography variant="body1" gutterBottom>
              With Redux Toolkit, even a simple feature can require numerous lines of code.
            </Typography>
            <List>
              <ListItem><ListItemText primary="Minimal setup and configuration" /></ListItem>
              <ListItem><ListItemText primary="Uses plain JavaScript functions and hooks" /></ListItem>
              <ListItem><ListItemText primary="No need for action types or reducers" /></ListItem>
            </List>
          </Box>
        </Grid>

        <Grid item xs={1} sx={{ borderLeft: "1px solid #ddd" }}></Grid>

        <Grid item xs={5}>
          <Box sx={{ marginTop: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                {status === "error" && (
                  <Alert sx={{ marginTop: 1 }} severity="error">Please enter valid values!</Alert>
                )}

                <TextField margin="normal" required fullWidth id="firstName" label="First Name" name="firstName" onChange={handleChange} />
                <TextField margin="normal" required fullWidth id="lastName" label="Last Name" name="lastName" onChange={handleChange} />
                <TextField margin="normal" required fullWidth id="username" label="Username" name="username" onChange={handleChange} />
                <TextField margin="normal" required fullWidth id="email" label="Email" name="email" error={!!errorEmail} helperText={errorEmail} onChange={handleChange} />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Password Confirm"
                  type={showPassword ? "text" : "password"}
                  id="passwordConfirm"
                  error={userState.password !== userState.passwordConfirm}
                  helperText={userState.password !== userState.passwordConfirm ? "Password does not match" : ""}
                  onChange={handleChange}
                />

                <Grid container>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          color="primary"
                        />
                      }
                      label="Show password"
                    />
                  </Grid>
                </Grid>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1, background: "#afa8a8", height: "50px" }}>
                  Sign Up
                </Button>

                <Grid item xs={12}>
                  <Typography textAlign="center">
                    By clicking Sign up, you agree to Locofy’s Terms.
                  </Typography>
                  <br />
                  <Typography textAlign="center">
                    Already have an account? Log In.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
