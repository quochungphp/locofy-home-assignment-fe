import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";
import "./style.css";
import { ErrorResponse } from "../../domain";
import { useDispatch, useSelector } from "react-redux";
import { postDetectFigmaFileKey } from "../../reduxStore/figma/action";
import { detectFigmaFileKeySelector } from "../../reduxStore/figma/slideReducer";
import { FigmaParsedView } from "../FigmaParsedView";

export const FigmaDetectFileKey = () => {
  const dispatch = useDispatch();
  const initialState = useSelector(detectFigmaFileKeySelector);
  const [figmaUrl, setFigmaUrl] = React.useState("");
  const [errors, setErrors] = React.useState<ErrorResponse[]>();
  const [status, setStatus] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (figmaUrl) {
      dispatch(postDetectFigmaFileKey({ url: figmaUrl }));
    }
  };

  React.useEffect(() => {
    if (initialState.data.status) {
      setErrors(initialState.data.errors);
      setStatus(initialState.data.status);
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
        <Grid item lg={12}>
          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {status === "error" && errors?.length && (
                <Alert sx={{ marginTop: 1 }} severity="error" className="alertError">
                  {"Invalid Figma URL"}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="figmaUrl"
                label="Figma File URL"
                name="figmaUrl"
                autoFocus
                onChange={(e) => setFigmaUrl(e.target.value)}
              />

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
                Submit
              </Button>
            </Grid>
          </Box>

          {/* Parsed View appears here after success */}
          {status === "success" && initialState.data?.data?.rawJson && (
            <Box mt={4}>
              <FigmaParsedView figmaData={initialState.data.data.rawJson} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
