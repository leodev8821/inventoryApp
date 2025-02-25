import React, { useState, useEffect, useMemo } from 'react';
import {
    TextField,
    Button,
    Checkbox,
    Select,
    FormControlLabel,
    FormControl,
    InputLabel,
    Container,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useRegister from '../utils/hooks/useRegister.js';
import useAddressData from "../utils/hooks/useAddressData.js";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_names: '',
        email: '',
        pass: '',
        address: '' // Se construye a partir de formAddress
    });
    const [formAddress, setFormAddress] = useState({
        prov: '',
        mun: '',
        tipo: '',
        via: '',
        cop: ''
    });
    const [lopd, setLopd] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, loading, error } = useRegister();
    const { towns, addressTypes, loading: loadingAddressData, error: errorAddressData } = useAddressData();

    // Filtrar los municipios por la provincia seleccionada
    const filteredTowns = useMemo(() => {
        if (!selectedProvince) return towns;
        return towns.filter(town => town.province === selectedProvince);
    }, [towns, selectedProvince]);

    const handleProvinceChange = (e) => {
        setFormAddress(prev => ({ ...prev, prov: e.target.value, mun: '' }));
        setSelectedProvince(e.target.value);
    };

    useEffect(() => {
        // Construir el string de dirección
        const addressString = Object.values(formAddress).filter(Boolean).join(', ');
        setFormData(prevFormData => ({ ...prevFormData, address: addressString }));
    }, [formAddress]);

    const handleFormAddress = (e) => {
        const { id, value } = e.target;
        setFormAddress(prev => ({ ...prev, [id]: value }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleRegister = () => {
        register(formData);
    };

    if (loadingAddressData) {
        return <CircularProgress />;
    }

    if (errorAddressData) {
        return <Typography color="error">{errorAddressData}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="first_name"
                        label="First name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="last_names"
                        label="Last names"
                        name="last_names"
                        value={formData.last_names}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="pass"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="pass"
                        value={formData.pass}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Campos de dirección */}
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel id="provincia-label">Provincia</InputLabel>
                        <Select
                            labelId="provincia-label"
                            id="prov"
                            value={formAddress.prov}
                            label="Provincia"
                            onChange={handleProvinceChange}
                        >
                            <MenuItem value="">Seleccione una provincia</MenuItem>
                            {towns.map((province) => (
                                <MenuItem key={province._id} value={province.province}>
                                    {province.province}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel id="municipio-label">Municipio</InputLabel>
                        <Select
                            labelId="municipio-label"
                            id="mun"
                            value={formAddress.mun}
                            label="Municipio"
                            onChange={handleFormAddress}
                        >
                            <MenuItem value="">Seleccione un municipio</MenuItem>
                            {filteredTowns.map((town) => (
                                <MenuItem key={town._id} value={town.town}>
                                    {town.town}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel id="tipo-via-label">Tipo de vía</InputLabel>
                        <Select
                            labelId="tipo-via-label"
                            id="tipo"
                            value={formAddress.tipo}
                            label="Tipo de vía"
                            onChange={handleFormAddress}
                        >
                            {addressTypes.map((tipo) => (
                                <MenuItem key={tipo.type} value={tipo}>
                                    {tipo.type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="via"
                        label="Vía"
                        value={formAddress.via}
                        onChange={handleFormAddress}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="cop"
                        label="Código Postal"
                        value={formAddress.cop}
                        onChange={handleFormAddress}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={lopd}
                                onChange={() => setLopd(!lopd)}
                            />
                        }
                        label="Ley de Protección"
                    />
                    {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
