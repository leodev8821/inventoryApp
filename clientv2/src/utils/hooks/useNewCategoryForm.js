import { useState, useContext } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import useFetch from './useFetch.js';
import useNavigation from "./useNavigation.js";

const useNewCategoryForm = () => {

    const { notifySuccess, notifyError } = useToast();
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        category: ''
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
    }

    const handleNewCategory = async (data) => {

        if (!data.category) {
            setErrors({ category: 'Campo requerido' });
            return;
        }

        if (!user) {
            setErrors({ user: 'Usuario no autenticado' });
            notifyError('No se encontró información del usuario.', { position: 'top-center' });
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const token = sessionStorage.getItem("authToken");

            const response = await fetchData({
                endpoint: '/categories/new-category',
                method: 'POST',
                authorization: `${token}`,
                body: { category: data.category }
            });

            if (response?.newCategory) {
                notifySuccess('Nueva categoría creada', { position: 'top-center' });

                setTimeout(() => navigate(-1), 2000);
            } else {
                setErrors({ server: response?.error || 'Error al crear la categoría' });
                notifyError(response?.error || 'Error desconocido', { position: 'top-center' });
            }

        } catch (err) {
            console.error("Error al crear la categoría:", err);
            setErrors("An error occurred during handleNewCategory.");
        } finally {
            setLoading(false);
        }
    };

    return { formData, errors, loading, handleBack, handleChange, handleNewCategory };

};

export default useNewCategoryForm;