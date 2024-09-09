import React from "react";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

// Styled SidebarButton component for consistent UI design
const SidebarButton = styled(Button)(({ theme }) => ({
  width: "100%",
  color: "white",
  marginBottom: theme.spacing(2),
  backgroundColor: "#006C91",
  "&:hover": {
    backgroundColor: "#005273",
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/"); // Redirect to root path
  };

  return (
    <Box
      sx={{
        width: "200px",
        backgroundColor: "#002B3D",
        height: "100vh",
        padding: 2,
      }}
    >
      {["Profile", "Orders", "Settings", "Support"].map((item) => (
        <SidebarButton key={item} variant="contained">
          {item}
        </SidebarButton>
      ))}
      {/* Logout button */}
      <SidebarButton variant="contained" onClick={handleLogout}>
        Logout
      </SidebarButton>
    </Box>
  );
};

export default Sidebar;
