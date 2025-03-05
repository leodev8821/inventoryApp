import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
            }
        }
    }, []);

    const logout = () => {
        //sessionStorage.removeItem("authToken");
        sessionStorage.clear();
        console.log("He limpiado sessionStorage")
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
