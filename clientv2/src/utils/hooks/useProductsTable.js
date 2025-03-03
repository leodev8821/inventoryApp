import { useMemo } from 'react';
import useProductData from './useProductData.js';
import useCategoryData from './useCategoryData.js';

const useProductsTable = () => {
    const { products } = useProductData();
    const { categories } = useCategoryData();

    const columns = [
        { field: 'product', headerName: 'ID', width: 70 },
        { field: 'categoryName', headerName: 'Categoría', width: 130, valueGetter: (params) => params.row.categoryName },
        { field: 'bar_code', headerName: 'Código de Barras', width: 130 },
        { field: 'product_name', headerName: 'Nombre', width: 130 },
        { field: 'description', headerName: 'Nombre', width: 130 },
        { field: 'buy_price', headerName: 'Precio Compra', type: 'number', width: 90 },
        { field: 'sell_price', headerName: 'Precio Venta', type: 'number', width: 90 },
        { field: 'quantity', headerName: 'Cantidad', type: 'number', width: 90 }
    ];

    const rows = useMemo(() => {
        return products.map(product => {
            const category = categories.find(cat => cat.id === product.category_id);
            return {
                id: product.id,
                categoryName: category ? category.category_name : 'N/A',
                bar_code: product.bar_code,
                product_name: product.product_name,
                description: product.description,
                buy_price: product.buy_price,
                sell_price: product.sell_price,
                quantity: product.quantity,
            };
        });
    }, [products, categories]);

    const paginationModel = { page: 0, pageSize: 5 };

    return { columns, rows, paginationModel }
}

export default useProductsTable;