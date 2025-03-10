import React, { useContext } from 'react';
import { AuthContext } from '../utils/context/AuthContext';
import useNavigation from '../utils/hooks/useNavigation';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
} from '@mui/material';

const LogoutMessage = () => {
    const { logout } = useContext(AuthContext);
    const { navigate } = useNavigation();

    // Función de logout
    const handleLogout = () => {
        logout();
        setTimeout(() => {
            navigate('/');
        }, 100);
    };

    const handleNoButton = () =>{
        navigate('/dashboard/all-products');
    }

    return (
        <Card sx={{
            width: '50%',
            marginTop: 3,
            marginX: 'auto'
        }}>
            <CardContent sx={{ padding: 0 }}>
                <Box
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: 2,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}
                >
                    <Typography variant="h6" component="div">
                        ¿Quieres cerrar la sesión?
                    </Typography>
                </Box>
                <Box
                    component="form"
                    noValidate
                    sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            width: '100%'
                        }}
                    >
                        <Button variant="contained" color="success" onClick={handleLogout}>
                            Sí
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleNoButton}>
                            No
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )

}

export default LogoutMessage;