import React, { useContext, useEffect } from 'react';
import {
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';

const ProhibitMessage = () => {

    return (
        <Card sx={{ width: '100%', marginTop: 3 }}>
            <CardContent>
                <Box component="form" noValidate sx={{ mt: 1 }} >
                    <Typography>No se encuentra logueado. Redirigiendo...</Typography>
                    <CircularProgress />
                </Box>
            </CardContent>
        </Card>
    )

}

export default ProhibitMessage;