import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const useRolesData = () => {
    const { fetchData } = useFetch();
    const [roles, setRoles] = useState([]);
    const [errorRole, setErrorRole] = useState(null);

    const fetchRoles = useCallback(async () => {

        try{
            const token = sessionStorage.getItem("authToken");

            const data = await fetchData({
                endpoint: 'roles/all-roles',
                method: 'GET',
                authorization: `${token}`
            });

            if (!data) {
                setErrorRole("Error en la petición: No se recibió respuesta.");
                console.error("Fetch Error: No response received.");
                return;
            }

            setRoles(data.data);
            
        } catch (err) {
            console.error("Fetch Error:", err);
            setErrorRole("Error en la petición de datos. Inténtelo más tarde.");
        }
    }, [fetchData]);

    useEffect(() =>{
        fetchRoles();
    }, [fetchRoles]);

    return { roles, setErrorRole }
};

export default useRolesData;