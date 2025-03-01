import React, { useState, useEffect, useMemo } from 'react';
import {
    TextField,
    Button,
    Checkbox,
    Select,
    FormControlLabel,
    FormControl,
    InputLabel,
    FormHelperText,
    Container,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
    Fab,
    Card,
    CardContent,
    Divider,
    Grid2
} from '@mui/material';
import { VisibilityOff, ArrowBackIosNew } from '@mui/icons-material';
import useNavigation from "../utils/hooks/useNavigation.js";
import { useToast } from '../utils/context/ToastContext.jsx';

const NewProductForm = () => {
    const { notifySuccess, notifyError } = useToast();
    const { navigate } = useNavigation();
    const [formData, setFormData] = useState({
        img: '',
        category_id: 0,
        bar_code: '',
        product_name: '',
        description: '',
        buy_price: '',
        sell_price: ''
    });
    const [errors, setErrors] = useState({});

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        setFormData(prev => ({ ...prev, [field]: value }));
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
                    Nuevo Producto
                </Typography>
                <Card sx={{ width: '100%', marginTop: 3 }}>
                    <CardContent>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <Grid2 container spacing={2} sx={{ margin: 'auto' }}>

                                <Grid2 size={{ xs: 12 }}>
                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="provincia-label">Provincia</InputLabel>
                                        <Select
                                            labelId="provincia-label"
                                            id="province"
                                            name="province"
                                            size="small"
                                            value={formAddress.province}
                                            label="Provincia"
                                            onChange={handleProvinceChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Seleccione una provincia</MenuItem>
                                            {provinces.map((province) => (
                                                <MenuItem key={province} value={province}>
                                                    {province}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.province && <FormHelperText>{errors.province}</FormHelperText>}
                                    </FormControl>
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
                                        error={Boolean(errors.product_name)}
                                        helperText={errors.product_name}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="buy_price"
                                        name="buy_price"
                                        label="Precio de Compra"
                                        type="number"
                                        value={formData.buy_price}
                                        onChange={handleChange}
                                        error={Boolean(errors.buy_price)}
                                        helperText={errors.buy_price}
                                    />
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="sell_price"
                                        name="sell_price"
                                        label="Precio de Venta"
                                        type="number"
                                        value={formData.sell_price}
                                        onChange={handleChange}
                                        error={Boolean(errors.sell_price)}
                                        helperText={errors.sell_price}
                                    />
                                </Grid2>

                                {/* Selection Fields */}
                                <Grid2 size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}>
                                        Dirección
                                    </Divider>



                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="municipio-label">Municipio</InputLabel>
                                        <Select
                                            labelId="municipio-label"
                                            id="town"
                                            name="town"
                                            size="small"
                                            value={formAddress.town}
                                            label="Municipio"
                                            onChange={handleFormAddress}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Seleccione un municipio</MenuItem>
                                            {filteredTowns.map((town) => (
                                                <MenuItem key={town.town} value={town.town}>
                                                    {town.town}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.town && <FormHelperText>{errors.town}</FormHelperText>}
                                    </FormControl>

                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="tipo-via-label">Tipo de vía</InputLabel>
                                        <Select
                                            labelId="tipo-via-label"
                                            id="type"
                                            name="type"
                                            size="small"
                                            value={formAddress.type}
                                            label="Tipo de vía"
                                            onChange={handleFormAddress}
                                            onBlur={handleSelectBlur}
                                        >
                                            {addressTypes.map((tipo) => (
                                                <MenuItem key={tipo} value={tipo}>
                                                    {tipo}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                                    </FormControl>

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="road"
                                        name="road"
                                        label="Vía y número"
                                        value={formAddress.road}
                                        onChange={handleFormAddress}
                                        onBlur={(e) => {
                                            const { name, value } = e.target;
                                            setErrors(prev => ({ ...prev, [name]: value ? '' : 'Campo obligatorio' }));
                                        }}
                                        error={Boolean(errors.road)}
                                        helperText={errors.road}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="pc"
                                        name="pc"
                                        label="Código Postal"
                                        value={formAddress.pc}
                                        onChange={handleFormAddress}
                                        onBlur={(e) => {
                                            const { name, value } = e.target;
                                            setErrors(prev => ({ ...prev, [name]: value ? '' : 'Campo obligatorio' }));
                                        }}
                                        error={Boolean(errors.pc)}
                                        helperText={errors.pc}
                                    />
                                </Grid2>

                                {/* Fila 8: Checkbox */}
                                <Grid2 size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={lopd} onChange={() => setLopd(!lopd)} />}
                                        label="Acepto la Ley de Protección de Datos"
                                    />
                                    <a id="lopd_link" href="/">Ley de Protección</a>
                                    {errors.lopd && (
                                        <Typography color="error" variant="caption">
                                            {errors.lopd}
                                        </Typography>
                                    )}
                                </Grid2>

                                {/* Fila 9: Botón Registrar */}
                                <Grid2 size={{ xs: 12 }}>
                                    {error && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            {error}
                                        </Typography>
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={handleRegister}
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
}