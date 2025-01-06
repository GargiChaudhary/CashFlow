import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // New full name state
  const [mode, setMode] = useState("signin"); // "signin" or "signup"

  const handleModeChange = (event, newMode) => {
    if (newMode) setMode(newMode);
  };

  const handleAuth = async () => {
    try {
      if (mode === "signup") {
        // Sign up the user and update the profile with their name
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: fullName });
        alert("User signed up successfully!");
      } else {
        // Sign in the user
        await signInWithEmailAndPassword(auth, email, password);
        alert("User signed in successfully!");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      alert(error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignContent="center" alignItems="center" p={20} justifyContent="center">
      <Typography variant="h4" gutterBottom>
        My Cash Flow
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="signin">Sign In</ToggleButton>
        <ToggleButton value="signup">Sign Up</ToggleButton>
      </ToggleButtonGroup>
      {mode === "signup" && (
        <TextField
          label="Full Name"
          type="text"
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      )}
      <TextField
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAuth}>
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </Button>
    </Box>
  );
};

export default Auth;