import { useState, useContext } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import useFetch from './useFetch.js';
import useNavigation from "./useNavigation.js";

const useNewProductForm = () => {
    const { notifySuccess, notifyError } = useToast();
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        category_id: '',
        bar_code: '',
        product_name: '',
        description: '',
        buy_price: 0.0,
        sell_price: 0.0,
        image_url: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors({})
    };

    const handleSelectBlur = (e) => {
        const { id, value, name } = e.target;
        const field = id || name;
        if (!value) {
            setErrors(prev => ({ ...prev, [field]: `Campo obligatorio!` }));
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleNewProduct = async (data) => {
        if (!user) {
            setErrors({ user: 'Usuario no autenticado' });
            notifyError('No se encontró información del usuario.', { position: 'top-center' });
            return;
        }

        const errors = {};
        Object.keys(formData).forEach((key) => {
            const value = formData[key];

            // Validación para campos de texto
            if (typeof value === 'string' && value.trim() === '') {
                errors[key] = `El campo ${key} es obligatorio.`;
            }

            // Validación para campos numéricos
            if (key === 'buy_price' || key === 'quantity' || key === 'sell_price') {
                if (isNaN(Number(value)) || value <= 0) {
                    errors[key] = `El campo ${key} debe ser un número válido.`;
                }
            }

            // Validación para URLs
            if (key === 'image_url') {
                const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                if (!urlRegex.test(value)) {
                    errors[key] = `El campo ${key} debe ser una URL válida.`;
                }
            }
        });

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const token = sessionStorage.getItem("authToken");

            const response = await fetchData({
                endpoint: '/products/new-product',
                method: 'POST',
                authorization: `${token}`,
                body: data
            });

            if (response?.newProduct) {
                notifySuccess('Nueva producto creado', { position: 'top-center' });
                setTimeout(() => navigate(-1), 2000);
            } else {
                setErrors({ server: response?.error || 'Error al crear la categoría' });
                notifyError(response?.error || 'Error desconocido', { position: 'top-center' });
            }


        } catch (err) {
            console.error("Error al crear el producto:", err);
            setErrors("An error occurred during handleNewProduct.");
        } finally {
            setLoading(false);
        }

    };
    return { formData, errors, loading, handleBack, handleChange, handleNewProduct, handleSelectBlur };
};
export default useNewProductForm;