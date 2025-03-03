import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const useCategoryData = () => {
    const { fetchData } = useFetch();
    const [categories, setCategories] = useState([]);
    const [errorCategory, setErrorCategory] = useState(null);

    const fetchCategories = useCallback(async () => {

        try{
            const token = sessionStorage.getItem("authToken");
            const data = await fetchData({
                endpoint: '/categories/all-categories',
                method: 'GET',
                authorization: `${token}`
            });

            if (!data) {
                setErrorCategory("Error en la petición: No se recibió respuesta.");
                console.error("Fetch Error: No response received.");
                return;
            }

            setCategories(data.data);
            
        } catch (err) {
            console.error("Fetch Error:", err);
            setErrorCategory("Error en la petición de datos. Inténtelo más tarde.");
        }
    }, [fetchData]);

    useEffect(() =>{
        fetchCategories();
    }, [fetchCategories]);

    return { categories, errorCategory }
};

export default useCategoryData;