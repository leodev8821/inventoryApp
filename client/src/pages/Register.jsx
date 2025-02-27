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
import Visibility from '@mui/icons-material/Visibility';
import { VisibilityOff, ArrowBackIosNew } from '@mui/icons-material';
import useRegister from '../utils/hooks/useRegister.js';
import useAddressData from "../utils/hooks/useAddressData.js";
import useNavigation from "../utils/hooks/useNavigation.js";
import { useToast } from '../utils/context/ToastContext.jsx';

const Register = () => {
    const { notifySuccess, notifyError } = useToast();
    const { navigate } = useNavigation();
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_names: '',
        email: '',
        pass: '',
        confirm_pass: '',
        address: '',
    });
    const [formAddress, setFormAddress] = useState({
        province: '',
        town: '',
        type: '',
        road: '',
        pc: '',
    });
    const [lopd, setLopd] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedProvince, setSelectedProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, loading, error } = useRegister();
    const {
        provinces,
        towns,
        addressTypes,
        loading: loadingAddressData,
        error: errorAddressData,
    } = useAddressData();

    // Filtrar municipios según la provincia seleccionada
    const filteredTowns = useMemo(() => {
        if (!selectedProvince) return towns;
        return towns.filter((town) => town.province === selectedProvince);
    }, [towns, selectedProvince]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleProvinceChange = (e) => {
        setFormAddress(prev => ({ ...prev, province: e.target.value, town: '' }));
        setSelectedProvince(e.target.value);
    };

    useEffect(() => {
        const addressString = Object.values(formAddress).filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, address: addressString }));
    }, [formAddress]);

    const handleFormAddress = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        setFormAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Validación para campos de texto
    const validateField = (field, value) => {
        let errorMessage = '';
        if (!value) {
            errorMessage = 'Campo obligatorio';
        } else if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Email inválido';
            }
        } else if (field === 'confirm_pass') {
            if (value !== formData.pass) {
                errorMessage = 'Las contraseñas no coinciden';
            }
        }
        return errorMessage;
    };

    const handleBlur = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        const errorMessage = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: errorMessage }));
    };

    // Validación para los Select (province, town, type)
    const handleSelectBlur = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        if (!value) {
            setErrors(prev => ({ ...prev, [field]: `Campo obligatorio!` }));
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRegister = () => {
        const newErrors = {};
        // Validar los campos de formData
        ['username', 'first_name', 'last_names', 'email', 'pass', 'confirm_pass'].forEach(field => {
            const errorMessage = validateField(field, formData[field]);
            if (errorMessage) {
                newErrors[field] = errorMessage;
                notifyError(errorMessage, { position: "top-right" });
            }
        });

        // Validar los campos de formAddress (todos obligatorios)
        ['province', 'town', 'type', 'road', 'pc'].forEach(field => {
            if (!formAddress[field]) {
                newErrors[field] = 'Campo obligatorio!';
            }
        });
        // Validar checkbox
        if (!lopd) {
            newErrors.lopd = 'Debes aceptar la Ley de Protección de Datos';
        }
        console.log(newErrors);

        if (newErrors) {
            notifyError(newErrors.lopd, { position: "top-right" });
        }
        setErrors(newErrors);
        // Si hay errores, no se envía el formulario
        if (Object.values(newErrors).some(err => err)) return;
        register(formData)
            .then(() => {
                // Mostrar notificación de éxito centrada
                notifySuccess("Te has registrado con éxito", { position: "top-center" });
                // Redirigir a la página de login tras un breve retardo
                setTimeout(() => navigate('/'), 2000);
            })
            .catch((err) => {
                console.error(err);
            });


    };

    if (loadingAddressData) {
        return <CircularProgress />;
    }

    if (errorAddressData) {
        return <Typography color="error">{errorAddressData}</Typography>;
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
                    Register
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
                                        id="first_name"
                                        name="first_name"
                                        label="Nombre(s)"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.first_name)}
                                        helperText={errors.first_name}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="last_names"
                                        name="last_names"
                                        label="Apellidos"
                                        value={formData.last_names}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.last_names)}
                                        helperText={errors.last_names}
                                    />

                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                    />
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="username"
                                        name="username"
                                        label="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.username)}
                                        helperText={errors.username}
                                    />
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="pass"
                                        name='pass'
                                        label="Contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.pass}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.pass)}
                                        helperText={errors.pass}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        id="confirm_pass"
                                        name="confirm_pass"
                                        label="Confirmar Contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirm_pass}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.confirm_pass)}
                                        helperText={errors.confirm_pass}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid2>

                                {/* Selection Fields */}
                                <Grid2 size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}>
                                        Dirección
                                    </Divider>

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
};

export default Register;
