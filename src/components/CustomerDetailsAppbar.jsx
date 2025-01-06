import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerDetailsAppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          {customer?.name || "Customer Details"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerDetailsAppBar;