import { useState, useEffect, useMemo } from "react";
import useFetch from "./useFetch";
import useNavigation from "./useNavigation";
import { useToast } from '../context/ToastContext.jsx';
import useAddressData from "../hooks/useAddressData.js";

const useRegister = () => {
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { notifySuccess, notifyError } = useToast();
    const {
        provinces,
        towns,
        addressTypes,
        loadingAddressData,
        errorAddressData,
    } = useAddressData();
    
    const [loading, setLoading] = useState(false);
    const [lopd, setLopd] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedProvince, setSelectedProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
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
                notifyError(`El campo ${field} es obligatorio`, { position: "top-right" });
            }
        });
    
        // Validar checkbox
        if (!lopd) {
            newErrors.lopd = 'Debes aceptar la Ley de Protección de Datos';
            notifyError(newErrors.lopd, { position: "top-right" });
        }
    
        // Actualizar el estado de errores
        setErrors(newErrors);
    
        // Si hay errores, no se envía el formulario
        if (Object.values(newErrors).some(err => err)) return;
    
        // Si no hay errores, proceder con el registro
        register(formData)
            .then(() => {
                notifySuccess("Te has registrado con éxito", { position: "top-center" });
                setTimeout(() => navigate('/'), 2000);
            })
            .catch((err) => {
                console.error(err);
                notifyError("Error al registrar el usuario", { position: "top-right" });
            });
    };

    return { 
        loadingAddressData,
        errorAddressData,
        loading,
        errors,
        formData,
        provinces,
        addressTypes,
        showPassword,
        filteredTowns,
        formAddress,
        lopd,
        setErrors,
        setLopd,
        handleRegister,
        handleProvinceChange,
        setShowPassword,
        handleBack,
        handleChange,
        handleBlur,
        handleFormAddress,
        handleSelectBlur
    };
};

export default useRegister;