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
import { GoogleLogin } from 'react-google-login';
import "./style.css";
import { googleAppClientId } from "../../utils/envs";
import { AuthSigninPayloadDto, ErrorResponse } from "../../domain";
import { postSignInByPassword } from "../../reduxStore/signin-request-by-password/action";
import { useDispatch, useSelector } from "react-redux";
import {serverApi} from "../../resources/server-api"
import { signInByPasswordSelector } from "../../reduxStore/signin-request-by-password/sliceReducer";
import { Alert } from "@mui/material";
export const SignIn = () => {
  const dispatch = useDispatch();
  const initialState = useSelector(signInByPasswordSelector);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<ErrorResponse[]>();
  const [status, setStatus] = React.useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username && password) {
      const payload: AuthSigninPayloadDto = {
        username,
        password,
      };
      dispatch(postSignInByPassword(payload));
    }
  };
  React.useEffect(() => {
    if (initialState.data.status) {
      setErrors(initialState.data.errors)
      setStatus(initialState.data.status)
    }
  }, [initialState]);
  
  const accessToken = serverApi.getAccessToken();
  React.useEffect(() => {
    
    if (status === 'success' || accessToken) {
      window.location.href = '/figma-detect-file';
    }
  }, [status, accessToken]);
  return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          padding: "40px 30px",
          borderRadius: "20px",
          marginTop: "60px",
          backgroundColor: "white",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
        }}
      > 
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
        component="img"
        alt="Locofy"
        src="mainLogo.svg"
        sx={{
          width: 120, // fixed width
          height: "auto",
          backgroundColor: "#8a2be2",
          padding: "5px",
          marginBottom: 2,
          display: "block",
          borderRadius: "12px", // optional rounded edges
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // soft shadow
        }}
        />
        <Typography component="h1" variant="h5" mb={1}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

          <Grid container spacing={2}>
            {status === 'error' && <Alert sx={{marginTop: 1}} severity="error" className="alertError">Username and Password are not correct!</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid container>
              <Grid item xs>
                <FormControlLabel
                  control={<Checkbox value="showPassword" color="primary" />}
                  label="Show password"
                  className="textSubColor"
                />
              </Grid>

              <Grid item>
                <FormControlLabel
                  control={
                    <Link
                      href="users/forgot-password"
                      color="primary"
                      mt={5}
                      style={{ flex: 1 }}
                    />
                  }
                  label="Forgot password"
                  className="textSubColor"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                height: "50px",
                borderRadius: "8px",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(135deg, #5d0eb2, #1d63d2)",
                },
              }}
              size="large"
            >
              Sign In
            </Button>
            <Grid item xs={12} mb={2}>
              <Typography className="textSubColor" textAlign={"center"}>
                OR
              </Typography>
            </Grid>
            <GoogleLogin
              style={{
                marginTop: '1cm'
              }}
              clientId={googleAppClientId}
              buttonText="Sign in With Google"
              // onSuccess={responseGoogle}
              // onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              className="btn-google"
            />

            <Grid item xs={12}>
              <Typography className="textSubColor" textAlign={"center"}>
                "Not on Locofy yet ?
                <Link href="#" variant="body2" className="textSubColor">
                  <b>{" Sign Up "}</b>
                </Link>{" "}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
