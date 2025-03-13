import { useMemo, useState, useEffect, useContext } from 'react';
import useInventoryData from './useInventoryData.js';
import useProductData from './useProductData.js';
import useCategoryData from './useCategoryData.js';
import useFetch from './useFetch.js';
import useNavigation from './useNavigation.js';
import { useToast } from '../context/ToastContext.jsx';

const useInventoryTables = () => {
    const { registers, errorRegister, handleEdit } = useInventoryData();
    const { products, errorProduct } = useProductData();
    const { categories, errorCategory } = useCategoryData();
    const { notifySuccess, notifyError } = useToast();
    const { navigate } = useNavigation();
    const { fetchData } = useFetch();
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [loadingAction, setLoadingAction] = useState(false);

    // Simplificamos la inicialización
    useEffect(() => {
        if (registers && products && categories) {
            setLoading(false);
        }
    }, [registers, products, categories]);

    // Columnas
    const columnsT1 = useMemo(() => [
        { field: 'id', headerName: 'ID', type: 'number' },
        { field: 'category', headerName: 'Categoría' },
        { field: 'quantity', headerName: 'Cantidad en stock', type: 'number' },
        { field: 'value', headerName: 'Valor del Stock', type: 'number' }
    ], []);

    const columnsT2 = useMemo(() => [
        { field: 'id', headerName: 'ID', type: 'number' },
        { field: 'bar_code', headerName: 'Código de Barras' },
        { field: 'product_name', headerName: 'Nombre' },
        { field: 'quantity', headerName: 'Cantidad en stock', type: 'number' },
        { field: 'value', headerName: 'Valor del Stock', type: 'number' }
    ], []);

    // Filas
    const rowsT1 = useMemo(() => {
        if (!registers || !products || !categories) return [];

        // Agrupar registros por categoría
        const groupedByCategory = registers.reduce((acc, register) => {
            const product = products.find(prod => prod.id === register.product);
            const category = categories.find(cat => cat.id === product?.category_id);
            const categoryName = category?.category || 'N/A';

            // Inicializar la categoría si no existe
            if (!acc[categoryName]) {
                acc[categoryName] = {
                    category: categoryName,
                    quantity: 0,
                    value: 0
                };
            }

            // Sumar valores
            acc[categoryName].quantity += Number(register.quantity) || 0;
            acc[categoryName].value += Number(register.value) || 0;

            return acc;
        }, {});

        // Convertir el objeto agrupado a array
        return Object.values(groupedByCategory).map((category, index) => ({
            id: index + 1,
            category: category.category,
            quantity: category.quantity,
            value: category.value
        }));

    }, [registers, products, categories]);

    const rowsT2 = useMemo(() => {
        if (!registers || !products) return [];

        return registers?.map(register => {
            const product = products.find(prod => prod?.id === register.product);

            // Manejar productos no encontrados
            if (!product) {
                return {
                    id: 'N/A',
                    bar_code: 'No encontrado',
                    product_name: 'Producto eliminado',
                    quantity: register.quantity,
                    value: register.value
                };
            }

            return {
                id: product.id,
                bar_code: product.bar_code || 'Sin código',
                product_name: product.product_name,
                quantity: register.quantity,
                value: register.value
            };
        });
    }, [registers, products]);

    return {
        columnsT1,
        columnsT2,
        rowsT1,
        rowsT2,
        loading,
        errors: { errorRegister, errorProduct, errorCategory },
        loadingAction,
        selected,
        setSelected,
        handleEdit
    };
};

export default useInventoryTables;