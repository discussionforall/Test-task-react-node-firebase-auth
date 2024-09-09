import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

// Custom Button styling
const StyledCustomButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#006C91",
  border: "1px solid white",
  "&:hover": {
    backgroundColor: "#005273",
  },
}));

const CustomButton = (props) => {
  return <StyledCustomButton {...props}>{props.children}</StyledCustomButton>;
};

export default CustomButton;
