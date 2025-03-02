import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useNewProduct = () => {
    const { fetchData } = useFetch();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para manejar el error de la respuesta
    const handleError = async (response) => {
        try {
            const errorData = await response.json();
            const errorMessage = `Server Error: ${response.status} - ${errorData.message || response.statusText}`;
            setError(errorMessage);
            console.error("Server Error:", errorMessage, errorData);
        } catch (jsonError) {
            const errorMessage = `Server Error (no JSON): ${response.status} - ${response.statusText}`;
            setError(errorMessage);
            console.error("Server Error (no JSON):", errorMessage);
        }
    };

    // Función principal de fetch de datos
    const fetchDataAsync = async () => {
        setLoading(true);
        setError(null);
        let types = [];

        try {
            const data = await fetchData({
                endpoint: "/address/all-address-data",
                method: "GET",
            });           

            if (!data) {
                setError("Error en la petición: No se recibió respuesta.");
                console.error("Fetch Error: No response received.");
                return;
            }

            if (data) {

                data.types.forEach(type => {
                    const capitalzed = type.type.charAt(0).toUpperCase() + type.type.slice(1).toLowerCase();
                    types.push(capitalzed);
                });

                setProvinces(data.provinces);
                setTowns(data.towns);
                setAddressTypes(types);
            } else {
                handleError(data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Error en la petición de datos. Inténtelo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAsync();
    }, [fetchData]);

    return { provinces, towns, addressTypes, loading, error };
};

export default useNewProduct;
