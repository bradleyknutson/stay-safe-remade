import React, { SyntheticEvent, useState } from "react";
import { Button, Container, Grid, TextField } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";

const SignupStyle = {
  display: "flex",
  alignItems: "center",
  height: "100vh",
};

export const SignupPage = () => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleInputChange = (e: SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      console.log(data);
    } catch (err) {
      console.error(err);
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
          <TextField
            required
            id="email"
            name="email"
            label="email"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              console.log(
                userFormData.username,
                userFormData.password,
                userFormData.email
              );
            }}
          >
            Sign In
          </Button>
          <Button
            href="/signup"
            variant="contained"
            color="secondary"
            disabled={
              !(
                userFormData.username &&
                userFormData.email &&
                userFormData.username
              )
            }
            onClick={handleFormSubmit}
          >
            Sign Up
          </Button>
        </Grid>
      </Container>
    </Grid>
  );
};
