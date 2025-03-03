import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const useProductData = () => {
    const { fetchData } = useFetch();
    const [products, setProducts] = useState([]);
    const [errorProduct, setErrorProduct] = useState(null);

    const fetchProducts = useCallback(async () => {

        try{
            const token = sessionStorage.getItem("authToken");
            const data = await fetchData({
                endpoint: '/products/all-products',
                method: 'GET',
                authorization: `${token}`
            });

            if (!data) {
                setErrorProduct("Error en la petición: No se recibió respuesta.");
                console.error("Fetch Error: No response received.");
                return;
            }

            setProducts(data.data);
            
        } catch (err) {
            console.error("Fetch Error:", err);
            setErrorProduct("Error en la petición de datos. Inténtelo más tarde.");
        }
    }, [fetchData]);

    useEffect(() =>{
        fetchProducts();
    }, [fetchProducts]);

    return { products, errorProduct }
};

export default useProductData;