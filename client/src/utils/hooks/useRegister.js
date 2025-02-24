import { useState, useContext } from "react";
import useFetch from "./useFetch";
import useNavigation from "./useNavigation";

const useRegister = () => {
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (formData) => {

        // verifica si los campos de formData estan no esta vacíos (false si lo estan)
        const validateForm = Object.values(formData).every(valor => {
            return valor.trim() !== "" && valor !== null && valor !== undefined;
          });

        if (!validateForm) {
            setError("Por favor rellene toda la información");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetchData({
                endpoint: "/inventory-app/v1/user/create-new-user",
                method: "POST",
                body: { ...formData },
            });

            if (response.ok) {
                console.log("Usuario creado:", await response.json());
                navigate("/login");
            } else {
                console.error("Error al crear usuario:", response.status, await response.text());
                setError("Invalid login credentials.");
            }

        } catch (err) {
            console.error("Login failed:", err);
            setError("An error occurred during register.");
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
};

export default useRegister;