import { useState, useEffect, useCallback } from "react";
import { useToast } from '../context/ToastContext.jsx';
import useFetch from "./useFetch";

const useInventoryData = () => {
    const { fetchData } = useFetch();
    const [registers, setRegisters] = useState([]);
    const { notifySuccess, notifyError } = useToast();
    const [errorRegister, setErrorRegister] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const fetchRegisters = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            const data = await fetchData({
                endpoint: '/inventory/all-registers',
                method: 'GET',
                authorization: `${token}`
            });

            if (!data?.data) {
                setErrorRegister("No se encontraron registros de inventario");
                console.error("Error: Respuesta vacía del servidor");
                return;
            }

            setRegisters(Array.isArray(data.data) ? data.data : []);

        } catch (err) {
            console.error("Fetch Error:", err);
            setErrorRegister(err.message || "Error obteniendo registros");
        }
    }, [fetchData]);

    const handleEdit = useCallback(async (product_id, newQuantity) => {
        setLoadingAction(true);
        try {
            const token = sessionStorage.getItem("authToken");
            const data = await fetchData({
                endpoint: `/inventory/change-quantity/${product_id}`,
                method: 'PUT',
                authorization: `${token}`,
                body: { quantity: newQuantity }
            });

            if (data.ok) {
                notifySuccess("Cantidad modificada", { autoClose: 500, position: 'top-center' });
                await fetchRegisters();
                return { success: true };
            } else {
                setErrorRegister(data.message || "Error al actualizar la cantidad");
                notifyError(data.message, { autoClose: 500, position: 'top-center' });
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error("Edit Error:", err);
            setErrorRegister(err.error || "Error al actualizar la cantidad");
            notifyError(err.error, { autoClose: 500, position: 'top-center' });
            return { success: false, error: err.error };
        } finally {
            setLoadingAction(false);
        }
    }, [fetchData, fetchRegisters]);

    useEffect(() =>{
        fetchRegisters();
    }, [fetchRegisters]);


    return { registers, errorRegister, handleEdit, loadingAction }
};

export default useInventoryData;