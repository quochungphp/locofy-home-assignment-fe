import * as React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";

export const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Simple validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    // Mock API call
    console.log("Password reset requested for:", email);
    setSuccess(true);
  };

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
            width: 120,
            height: "auto",
            backgroundColor: "#8a2be2",
            padding: "5px",
            marginBottom: 2,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Typography component="h1" variant="h5" mb={1}>
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert sx={{ marginBottom: 2 }} severity="error">
              {error}
            </Alert>
          )}
          {success && (
            <Alert sx={{ marginBottom: 2 }} severity="success">
              If an account exists for {email}, you will receive a reset email.
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
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
            Send Reset Link
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
