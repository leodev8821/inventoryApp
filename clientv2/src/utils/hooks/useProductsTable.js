import { useMemo, useState, useEffect } from 'react';
import useProductData from './useProductData.js';
import useCategoryData from './useCategoryData.js';

const useProductsTable = () => {
    const { products, errorProduct } = useProductData();
    const { categories, errorCategory } = useCategoryData();
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    // Retraso de 500ms para asegurarme que los datos de useProductData y useCategoryData ya esten definidos
    useEffect(() => {
        if (products && categories) {
            setTimeout(() => {
                setLoading(false);
                setInitialized(true);
            }, 500);
        }
    }, [products, categories]);

    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'category', headerName: 'Categoría', width: 180 },
        { field: 'bar_code', headerName: 'Código de Barras', width: 130 },
        { field: 'product_name', headerName: 'Nombre', width: 130 },
        { field: 'description', headerName: 'Descripción', width: 350 },
        { field: 'buy_price', headerName: 'Precio Compra', type: 'number', width: 150 },
        { field: 'sell_price', headerName: 'Precio Venta', type: 'number', width: 150 },
        { field: 'quantity', headerName: 'Cantidad', type: 'number', width: 150 }
    ], [initialized]);

    const rows = useMemo(() => {
        if (!initialized || !products || !categories) {
            return [];
        }

        return products.map(product => {
            const category = categories.find(cat => cat.id === product.category_id);
            return {
                id: product.id,
                category: category?.category || 'N/A',
                bar_code: product.bar_code,
                product_name: product.product_name,
                description: product.description,
                buy_price: product.buy_price,
                sell_price: product.sell_price,
                quantity: product.quantity,
            };
        });
    }, [initialized, products, categories]);

    const paginationModel = useMemo(() => ({ page: 0, pageSize: 5 }), []);

    return { columns, rows, paginationModel, loading, errorProduct, errorCategory };
};

export default useProductsTable;