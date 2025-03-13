import { useState, useContext, useEffect } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import useFetch from './useFetch.js';
import useNavigation from "./useNavigation.js";

const useProductForm = (productId) => {
    const { notifySuccess, notifyError } = useToast();
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { user } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category_id: '',
        bar_code: '',
        product_name: '',
        description: '',
        buy_price: 0.0,
        sell_price: 0.0,
        image_url: ''
    });


    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem("authToken");
                const response = await fetchData({
                    endpoint: `/products/${productId}`,
                    method: "GET",
                    authorization: `${token}`
                });

                if (response?.data) {
                    setFormData({
                        id: response.data.id,
                        category_id: response.data.category_id,
                        bar_code: response.data.bar_code,
                        product_name: response.data.product_name,
                        description: response.data.description,
                        buy_price: parseFloat(response.data.buy_price),
                        sell_price: parseFloat(response.data.sell_price),
                        image_url: response.data.image_url
                    });
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
                notifyError('Error al cargar el producto', { position: 'top-center' });
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId]);

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

    const handleSubmit = async () => {
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

            const endpoint = productId 
                ? `/products/${productId}`
                : '/products/new-product';

            const method = productId ? 'PUT' : 'POST';

            const response = await fetchData({
                endpoint,
                method,
                authorization: `${token}`,
                body: formData
            });

            if (response?.ok) {
                const message = productId
                    ? 'Producto actualizado correctamente'
                    : 'Nuevo producto creado';

                notifySuccess(message, { autoClose: 500, position: 'top-center' });
                setTimeout(() => navigate(-1), 1000);
            } else {
                setErrors({ server: response?.error || 'Error al crear la categoría' });
                notifyError(response?.error.message || 'Error desconocido', { position: 'top-center' });
            }


        } catch (err) {
            console.error("Error al crear el producto:", err);
            setErrors("An error occurred during handleNewProduct.");
        } finally {
            setLoading(false);
        }

    };
    return { formData, errors, loading, handleBack, handleChange, handleSubmit, handleSelectBlur };
};
export default useProductForm;