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
            setError("Tienes que llenar todos los campos");
            notifyError(error);
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
                setUser(decodedToken);
                notifySuccess(`${decodedToken.username}, te has logueado correctamente.`, { position: "top-center" });
                navigate("/dashboard/all-products");
            } else {
                setError("Credenciales incorrectas.");
                notifyError(error);
            }
        } catch (err) {
            setError(err.message);
            notifyError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};

export default useLogin;