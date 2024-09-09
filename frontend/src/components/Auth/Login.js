import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { db } from '../../services/firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        localStorage.clear()
        try {
            if (email === process.env.REACT_APP_ADMIN_EMAIL && password === process.env.REACT_APP_ADMIN_PASSWORD) {
                const role = 'admin';
                localStorage.setItem('userRole', role);
                navigate(`/${role}`);
            } else {
                const user = await login(email, password);
                const role = await determineRole(user.email);

                if (role === 'dealer') {
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('dealerEmail', user.email);
                    navigate(`/${role}`);
                } else if (role === 'customer') {
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('customerEmail', user.email);
                    navigate(`/${role}`);
                } else {
                    throw new Error('Unauthorized login');
                }
            }
        } catch (err) {
            console.error('Login error:', err); // Print error details
            setError(err.message);
        }
    };

    const determineRole = async (email) => {
        // Check if the user is a dealer
        const dealerQuery = query(collection(db, "dealers"), where("email", "==", email));
        const dealerSnapshot = await getDocs(dealerQuery);
        console.log('Dealer Snapshot:', dealerSnapshot.docs); // Debugging

        if (!dealerSnapshot.empty) {
            return 'dealer';
        }

        // Check if the user is a customer
        const customerQuery = query(collection(db, "customers"), where("email", "==", email));
        const customerSnapshot = await getDocs(customerQuery);
        console.log('Customer Snapshot:', customerSnapshot.docs); // Debugging

        if (!customerSnapshot.empty) {
            return 'customer';
        }

        return null; // Or throw an error for unauthorized access
    };

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleLogin}
                display="flex"
                flexDirection="column"
                gap={2}
                mt={5}
            >
                <Typography variant="h5" textAlign="center">
                    Login
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
