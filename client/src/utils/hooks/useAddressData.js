import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useAddressData = () => {
    const { fetchData } = useFetch();
    const [provinces, setProvinces] = useState([]);
    const [towns, setTowns] = useState([]);
    const [addressType, setAddressType] = useState([]); // Corrección de typo
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true);
            setError(null); // Resetear el error

            try {
                const requests = [
                    fetchData({ endpoint: "/inventory-app/v1/address/all-provinces", method: "GET" }),
                    fetchData({ endpoint: "/inventory-app/v1/address/all-towns", method: "GET" }),
                    fetchData({ endpoint: "/inventory-app/v1/address/all-address-type", method: "GET" })
                ];

                const responses = await Promise.all(requests);

                if (responses.every(response => response.ok)) {
                    const [provResponse, townResponse, addressTypeResponse] = responses;

                    const prov = await provResponse.json();
                    const town = await townResponse.json();
                    const addrs = await addressTypeResponse.json();

                    setProvinces(prov);
                    setTowns(town);
                    setAddressType(addrs);
                } else {
                    const errorMessages = responses.map(response => {
                        if (!response.ok) {
                            return `Error: ${response.status} - ${response.statusText}`;
                        }
                        return ""; // Para las respuestas ok
                    }).filter(message => message !== ""); // Filtra cadenas vacías

                    setError(`Error al obtener datos: ${errorMessages.join(" / ")}`);
                }
            } catch (err) {
                console.error("Error en la petición de datos:", err);
                setError("Error en la petición de datos. Inténtelo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchDataAsync();
    }, [fetchData]); // Dependencia de fetchData

    return { provinces, towns, addressType, loading, error }; // Devuelve loading y error
};

export default useAddressData;