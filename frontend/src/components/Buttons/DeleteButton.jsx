import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

// Delete Button styling
const StyledDeleteButton = styled(Button)(({ theme }) => ({
    color: "white",
    backgroundColor: "#f96a3d",
    border: "1px solid white",
    "&:hover": {
        backgroundColor: "#d7532a",
    },
}));

const DeleteButton = (props) => {
    return <StyledDeleteButton {...props}>{props.children}</StyledDeleteButton>;
};

export default DeleteButton;
