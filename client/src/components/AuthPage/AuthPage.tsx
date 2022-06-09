import React, { SyntheticEvent, useState } from "react";
import { Button, Container, Grid, TextField } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER, LOGIN_USER } from "../../utils/mutations";
import auth from "../../utils/auth";

const SignupStyle = {
  display: "flex",
  alignItems: "center",
  height: "100vh",
};

interface AuthPageProps {
  variant: "login" | "signup";
}

export const AuthPage = (props: AuthPageProps) => {
  const { variant } = props;
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error: addUserError }] = useMutation(ADD_USER);
  const [login, { error: loginError }] = useMutation(LOGIN_USER);

  const handleInputChange = (e: SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setUserFormData({ ...userFormData, [name]: value });
  };

  const loginHandler = async () => {
    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
  };

  const signupHandler = async () => {
    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e: SyntheticEvent) => {
    e.preventDefault();
    switch (variant) {
      case "login":
        loginHandler();
        break;
      case "signup":
        signupHandler();
        break;
      default:
        break;
    }
  };

  return (
    <Grid sx={SignupStyle}>
      <Container>
        <Grid item>
          <TextField
            required
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          {variant === "signup" && (
            <TextField
              required
              id="email"
              name="email"
              label="email"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
            />
          )}
        </Grid>
        <Grid item display="flex" justifyContent="flex-end">
          {variant === "login" && (
            <Button variant="contained" color="success" href={"/signup"}>
              Create Account
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            disabled={
              !(
                userFormData.username &&
                userFormData.password &&
                (variant === "login" || userFormData.email)
              )
            }
            onClick={handleAuth}
          >
            {variant === "signup" && "Sign Up"}
            {variant === "login" && "Login"}
          </Button>
        </Grid>
      </Container>
    </Grid>
  );
};
