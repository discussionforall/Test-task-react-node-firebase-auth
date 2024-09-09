import React from "react";
import { Typography, Box } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";

const CustomerDashboard = () => {
  const email = localStorage.getItem("customerEmail");
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar /> {/* Use Sidebar component */}
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Customer Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome, {email} !
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
