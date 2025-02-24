import React, { useState, useEffect } from 'react';
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
        address: '' // No se usa directamente, se construye a partir de formAddress
    });
    const [formAddress, setFormAddress] = useState({
        ca: '', // No se usa, se podría eliminar si no es necesario en el futuro
        prov: '',
        mun: '',
        tipo: '',
        via: '',
        cop: ''
    });
    const [lopd, setLopd] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, loading, error } = useRegister();
    const { provinces, towns, addressType, loading: loadingAddressData, error: errorAddressData } = useAddressData(); // Incluir loading y error de useAddressData

    useEffect(() => {
        // Construir el string de dirección a partir de formAddress
        const addressString = Object.values(formAddress).filter(Boolean).join(', '); // Filtra valores vacíos y los une
        setFormData(prevFormData => ({ ...prevFormData, address: addressString }));
    }, [formAddress]); // Dependencia de formAddress

    const handleFormAddress = (e) => {
        const { id, value } = e.target;
        setFormAddress({ ...formAddress, [id]: value });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleRegister = (e) => {
        register(formData);
    };

    if (loadingAddressData) { // Mostrar un indicador de carga mientras se obtienen los datos de dirección
        return <CircularProgress />; // O un componente de carga más elaborado
    }

    if (errorAddressData) { // Mostrar un mensaje de error si falla la carga de datos de dirección
        return <Typography color="error">{errorAddressData}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
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
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="first_name"
                        label="First_name"
                        name="first_name"
                        autoComplete="first_name"
                        autoFocus
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First name"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="last_names"
                        label="Last_names"
                        name="last_names"
                        autoComplete="last_names"
                        autoFocus
                        value={formData.last_names}
                        onChange={handleChange}
                        placeholder="Lastnames"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        type='email'
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="pass"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="pass"
                        autoComplete="pass"
                        value={formData.pass}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="lopd"
                                color="primary"
                                checked={lopd}
                                onChange={() => setLopd(!lopd)}
                            />
                        }
                        label="Ley de Protección"
                    />
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {/*-----------------------ADDRESS------------------------------------- */}
                    {/* <FormControl margin="normal" required fullWidth>
                        <InputLabel id="comunidad-autonoma-label">Comunidad Autónoma</InputLabel>
                        <Select
                            labelId="comunidad-autonoma-label"
                            id="ca"
                            name="comunidadAutonoma"
                            value={formAddress.ca}
                            label="Comunidad Autónoma"
                            onChange={handleFormAddress}
                        >
                            {comunidadesAutonomas.map((comunidad) => (
                                <MenuItem key={comunidad} value={comunidad}>
                                    {comunidad}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}


                    <FormControl margin="normal" required fullWidth>
                        <InputLabel id="provincia-label">Provincia</InputLabel>
                        <Select
                            labelId="provincia-label"
                            id="prov"
                            name="provincia"
                            value={formAddress.prov}
                            label="Provincia"
                            onChange={handleFormAddress}
                        >
                            {provinces.map((province) => (
                                <MenuItem key={province.province} value={province.province}>
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
                            name="municipio"
                            value={formAddress.mun}
                            label="Municipio"
                            onChange={handleFormAddress}
                        >
                            {towns.map((town) => (
                                <MenuItem key={town.town} value={town.town}>
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
                            name="tipoVia"
                            value={formAddress.tipo}
                            label="Tipo de vía"
                            onChange={handleFormAddress}
                        >
                            {addressType.map((tipo) => (
                                <MenuItem key={tipo.type} value={tipo.type}>
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
                        name="via"
                        autoFocus
                        value={formAddress.via}
                        onChange={handleFormAddress}
                        placeholder="Coronas 7"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="cop"
                        label="Código Postal"
                        name="cop"
                        autoFocus
                        value={formAddress.cop}
                        onChange={handleFormAddress}
                        placeholder="28000"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => handleRegister(formData)}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;