import { useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import useFetch from "./useFetch";
import useNavigation from "./useNavigation";
import { AuthContext } from "../context/AuthContext";
import { useToast } from '../context/ToastContext';

const useLogin = () => {
    const { notifySuccess, notifyError } = useToast();
    const { fetchData } = useFetch();
    const { navigate } = useNavigation();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (login_data, password) => {
        if (!login_data || !password) {
            setError("Please enter both login and password.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetchData({
                endpoint: "/user/login",
                method: "POST",
                body: { login_data, password },
            });

            if (response?.token) {
                sessionStorage.setItem("authToken", response.token);
                const decodedToken = jwtDecode(response.token);
                setUser(decodedToken); // Almacena el usuario en el contexto de autenticación
                notifySuccess("Logueado correctamente.", { position: "top-center" });
                navigate("/dashboard");
            } else {
                setError("Credenciales incorrectas.");
                notifyError(error);
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError("An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};

export default useLogin;