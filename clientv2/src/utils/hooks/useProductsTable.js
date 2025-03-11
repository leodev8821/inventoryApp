import { useMemo, useState, useEffect, useContext } from 'react';
import useProductData from './useProductData.js';
import useCategoryData from './useCategoryData.js';
import { AuthContext } from '../context/AuthContext.jsx';
import useFetch from './useFetch.js';
import useNavigation from './useNavigation.js';
import { useToast } from '../context/ToastContext.jsx';

const useProductsTable = () => {
    const { products, errorProduct } = useProductData();
    const { categories, errorCategory } = useCategoryData();
    const { notifySuccess, notifyError } = useToast();
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const { user } = useContext(AuthContext);
    const { navigate } = useNavigation();
    const [loadingAction, setLoadingAction] = useState(false);
    const { fetchData } = useFetch();

    // Simplificamos la inicialización
    useEffect(() => {
        if (products && categories && user) {
            setLoading(false);
        }
    }, [products, categories, user]);

    // Columnas básicas sin configuración de DataGrid
    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', type: 'number' },
        { field: 'category', headerName: 'Categoría' },
        { field: 'bar_code', headerName: 'Código de Barras' },
        { field: 'product_name', headerName: 'Nombre' },
        { field: 'description', headerName: 'Descripción' },
        { field: 'buy_price', headerName: 'Precio Compra', type: 'number' },
        { field: 'sell_price', headerName: 'Precio Venta', type: 'number' }
    ], []);

    // Filas con formato consistente
    const rows = useMemo(() => {
        if (!products || !categories) return [];

        return products.map(product => {
            const category = categories.find(cat => cat.id === product.category_id);
            return {
                id: product.id,
                category: category?.category || 'N/A',
                bar_code: product.bar_code || 'Sin código',
                product_name: product.product_name,
                description: product.description || 'Sin descripción',
                buy_price: product.buy_price,
                sell_price: product.sell_price
            };
        });
    }, [products, categories]);

    const handleEdit = async () => {
        if (selected.length !== 1) return;

        try {
            const productId = selected[0];
            // Redirige a la pantalla de edición con el ID
            navigate(`/products/edit/${productId}`);
        } catch (error) {
            console.error('Error navigating to edit:', error);
        }
    };

    const handleDelete = async () => {
        if (!selected.length) return;

        // Confirmación antes de eliminar
        const confirmDelete = window.confirm(
            `¿Estás seguro de eliminar ${selected.length} producto(s)?`
        );

        if (!confirmDelete) return;

        try {
            setLoadingAction(true);

            // Eliminar múltiples productos en paralelo
            const deletePromises = selected.map(id => async () => {
                const token = sessionStorage.getItem("authToken");
                const data = await fetchData({
                    endpoint: `inventory-app/v1/products/${id}`,
                    method: 'DELETE',
                    authorization: `${token}`
                });
            });

            await Promise.all(deletePromises);

            setSelected([]);
            notifySuccess("Te has registrado con éxito", { position: "top-center" });
            setTimeout(() => navigate('/dashboard/all-products'), 1000);
        } catch (error) {
            console.error('Error deleting products:', error);
            alert('Error al eliminar los productos');
        } finally {
            setLoadingAction(false);
        }
    };

    return {
        columns,
        rows,
        loading,
        errors: { errorProduct, errorCategory },
        loadingAction,
        selected, 
        setSelected,
        handleEdit,
        handleDelete
    };
};

export default useProductsTable;