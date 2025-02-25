import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useAddressData = () => {
    const { fetchData } = useFetch();
    const [towns, setTowns] = useState([]);
    const [addressTypes, setAddressTypes] = useState([]);
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

        try {
            const response = await fetchData({
                endpoint: "/inventory-app/v1/address/all-address-data",
                method: "GET",
            });

            

            if (!response) {
                setError("Error en la petición: No se recibió respuesta.");
                console.error("Fetch Error: No response received.");
                return;
            }

            console.log("Response:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Data:", data);
                setTowns(data.towns);
                setAddressTypes(data.types);
            } else {
                handleError(response);
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

    return { towns, addressTypes, loading, error };
};

export default useAddressData;
