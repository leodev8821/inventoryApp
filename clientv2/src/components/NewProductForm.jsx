import React from 'react';
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
    Fab,
    Card,
    CardContent,
    Divider,
    Grid2
} from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';
import useCategoryData from '../utils/hooks/useCategoryData.js';
import useNewProductForm from '../utils/hooks/useNewProductForm.js';

const NewProductForm = () => {
    const { formData, errors, loading, handleBack, handleChange, handleSelectBlur, handleNewProduct } = useNewProductForm();
    const { categories } = useCategoryData();

    return (
        <Container maxWidth="sm">

            <Box sx={{ marginTop: 2 }}>
                <Fab color="primary" aria-label="back" onClick={handleBack}>
                    <ArrowBackIosNew />
                </Fab>
            </Box>


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

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="quantity"
                                        name="quantity"
                                        label="Cantidad"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        onBlur={handleSelectBlur}
                                        error={Boolean(errors.quantity)}
                                        helperText={errors.quantity}
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    {errors && loading &&(
                                        <FormHelperText error>Tiene errores en el formulario</FormHelperText>
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => handleNewProduct(formData)}
                                        disabled={Boolean(errors || loading)}
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