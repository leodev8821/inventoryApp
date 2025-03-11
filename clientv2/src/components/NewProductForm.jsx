import React, { useContext, useEffect } from 'react';
import {
    TextField,
    Button,
    Select,
    FormControl,
    OutlinedInput,
    InputAdornment,
    InputLabel,
    FormHelperText,
    Container,
    Typography,
    Box,
    CircularProgress,
    MenuItem,
    Card,
    CardContent,
    Divider,
    Grid2
} from '@mui/material';
import useCategoryData from '../utils/hooks/useCategoryData.js';
import useNewProductForm from '../utils/hooks/useNewProductForm.js';
import ProhibitMessage from './ProhibitMessage.jsx';
import { AuthContext } from '../utils/context/AuthContext';

const NewProductForm = () => {
    const { formData, errors, loading, handleBack, handleChange, handleSelectBlur, handleNewProduct } = useNewProductForm();
    const { categories } = useCategoryData();

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
                <ProhibitMessage />
            )
        }

    return (
        <Container maxWidth="sm">

            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                <Typography component="h1" variant="h5">
                    Nuevo Producto
                </Typography>
                <Card sx={{ width: '100%', marginTop: 3 }}>
                    <CardContent>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <Grid2 container spacing={2} sx={{ margin: 'auto' }}>

                                <Grid2 size={{ xs: 12 }}>
                                    <FormControl fullWidth margin="normal" required error={Boolean(errors?.category_id)}>
                                        <InputLabel id="category-label">Categoría</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category_id"
                                            name="category_id"
                                            size="small"
                                            value={formData.category_id}
                                            label="Categoría"
                                            onChange={handleChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Seleccione una Categoría</MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem key={category.category} value={category.id}>
                                                    {category.category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors?.category_id && (
                                            <FormHelperText error>
                                                {errors.category_id}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    <Grid2 size={{ xs: 12 }}>
                                        <Divider sx={{ my: 2 }}>
                                            Nuevo Producto
                                        </Divider>
                                    </Grid2>

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="bar_code"
                                        name="bar_code"
                                        label="Código de Barras"
                                        value={formData.bar_code}
                                        onChange={handleChange}
                                        onBlur={handleSelectBlur}
                                        error={Boolean(errors.bar_code)}
                                        helperText={errors.bar_code}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="product_name"
                                        name="product_name"
                                        label="Nombre del Producto"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        onBlur={handleSelectBlur}
                                        error={Boolean(errors.product_name)}
                                        helperText={errors.product_name}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="description"
                                        name="description"
                                        label="Descripción del Producto"
                                        value={formData.description}
                                        onChange={handleChange}
                                        onBlur={handleSelectBlur}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                    />

                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="buy_price">Precio de Compra</InputLabel>
                                        <OutlinedInput
                                            id="buy_price"
                                            name="buy_price"
                                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                            label="Precio de Compra"
                                            type="number"
                                            value={formData.buy_price}
                                            onChange={handleChange}
                                            onBlur={handleSelectBlur}
                                            error={Boolean(errors.buy_price)}
                                        />
                                        {errors.buy_price && (
                                            <FormHelperText error>{errors.buy_price}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="sell_price">Precio de Venta</InputLabel>
                                        <OutlinedInput
                                            id="sell_price"
                                            name="sell_price"
                                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                            label="Precio de Venta"
                                            type="number"
                                            value={formData.sell_price}
                                            onChange={handleChange}
                                            onBlur={handleSelectBlur}
                                            error={Boolean(errors.sell_price)}
                                        />
                                        {errors.sell_price && (
                                            <FormHelperText error>{errors.sell_price}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="image_url"
                                        name="image_url"
                                        label="Imagen"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        onBlur={handleSelectBlur}
                                        error={Boolean(errors.image_url)}
                                        helperText={errors.image_url}
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    {errors && Object.keys(errors).length > 0 && loading &&(
                                        <FormHelperText error>Tiene errores en el formulario</FormHelperText>
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => handleNewProduct(formData)}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Registrar'}
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
export default NewProductForm;