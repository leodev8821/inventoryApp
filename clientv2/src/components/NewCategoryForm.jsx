import React, { useContext, useEffect } from 'react';
import {
    TextField,
    Button,
    FormHelperText,
    Container,
    Typography,
    Box,
    CircularProgress,
    Fab,
    Card,
    CardContent,
    Grid2
} from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';
import useNewCategoryForm from '../utils/hooks/useNewCategoryForm';
import { AuthContext } from '../utils/context/AuthContext';

const NewCategoryForm = () => {

    const { formData, errors, loading, handleBack, handleChange, handleNewCategory } = useNewCategoryForm();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                handleBack();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user, handleBack]);

    if (!user) {
        return (
            <Card sx={{ width: '100%', marginTop: 3 }}>
                <CardContent>
                    <Box component="form" noValidate sx={{ mt: 1 }} >
                        <h2>No se encuentra logueado. Redirigiendo...</h2>
                        <CircularProgress />
                    </Box>
                </CardContent>
            </Card>
        )
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm">

            <Box sx={{ marginTop: 2 }}>
                <Fab color="primary" aria-label="back" onClick={handleBack}>
                    <ArrowBackIosNew />
                </Fab>
            </Box>


            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                <Typography component="h1" variant="h5">
                    Nueva Categoría
                </Typography>
                <Card sx={{ width: '100%', marginTop: 3 }}>
                    <CardContent>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <Grid2 container spacing={2} sx={{ margin: 'auto' }}>

                                <Grid2 size={{ xs: 12 }}>
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="category"
                                        name="category"
                                        label="Categoría"
                                        value={formData.category}
                                        onChange={handleChange}
                                        error={Boolean(errors.category)}
                                        helperText={errors.category}
                                    />
                                    {errors && Object.keys(errors).length > 0 && (
                                        <FormHelperText variant="body2" color="error" sx={{ mt: 1 }}>
                                            {JSON.stringify(errors)}
                                        </FormHelperText>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => handleNewCategory(formData)}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Crear'}
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default NewCategoryForm;