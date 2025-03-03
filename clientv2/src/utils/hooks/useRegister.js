import { useState, useEffect, useMemo } from "react";
import useFetch from "./useFetch";
import useNavigation from "./useNavigation";
import { useToast } from '../context/ToastContext.jsx';
import useAddressData from "../hooks/useAddressData.js";

const useRegister = () => {
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { notifySuccess, notifyError } = useToast();
    const { provinces, towns, addressTypes, loadingAddressData, errorAddressData } = useAddressData();
    
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
        return selectedProvince ? towns.filter(town => town.province === selectedProvince) : towns;
    }, [towns, selectedProvince]);

    const validateField = (field, value) => {
        if (!value) return 'Campo obligatorio';
        if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        if (field === 'confirm_pass' && value !== formData.pass) return 'Las contraseñas no coinciden';
        return '';
    };

    const validateAllFields = () => {
        const newErrors = {};

        Object.keys(formData).forEach(field => {
            const errorMessage = validateField(field, formData[field]);
            if (errorMessage) newErrors[field] = errorMessage;
        });

        Object.keys(formAddress).forEach(field => {
            if (!formAddress[field]) newErrors[field] = 'Campo obligatorio!';
        });

        if (!lopd) newErrors.lopd = 'Debes aceptar la Ley de Protección de Datos';

        return newErrors;
    };

    const handleBlur = (e) => {
        const { id, name, value } = e.target;
        const field = id || name;
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    const handleChange = (e, setState) => {
        const { id, name, value } = e.target;
        setState(prev => ({ ...prev, [id || name]: value }));
    };

    useEffect(() => {
        const addressString = Object.values(formAddress).filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, address: addressString }));
    }, [formAddress]);

    const handleRegister = async () => {
        const newErrors = validateAllFields();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(err => notifyError(err, { position: "top-right" }));
            return;
        }

        setLoading(true);

        try {
            const response = await fetchData({
                endpoint: "/user/create-new-user",
                method: "POST",
                body: formData,
            });

            if (response) {
                notifySuccess("Te has registrado con éxito", { position: "top-center" });
                setTimeout(() => navigate('/'), 2000);
            } else {
                throw new Error("Error al crear usuario");
            }
        } catch (err) {
            notifyError("Error al registrar el usuario", { position: "top-right" });
        } finally {
            setLoading(false);
        }
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
        setLopd,
        handleRegister,
        handleChange: (e) => handleChange(e, setFormData),
        handleFormAddress: (e) => handleChange(e, setFormAddress),
        handleBlur,
        handleBack: () => navigate(-1),
        setShowPassword,
        handleProvinceChange: (e) => {
            setFormAddress(prev => ({ ...prev, province: e.target.value, town: '' }));
            setSelectedProvince(e.target.value);
        },
    };
};

export default useRegister;