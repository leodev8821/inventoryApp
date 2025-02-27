import React, { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    // Función para mostrar un toast de éxito
    const notifySuccess = (message, options = {}) => {
        toast.success(message, options);
    };

    // Función para mostrar un toast de error
    const notifyError = (message, options = {}) => {
        toast.error(message, options);
    };

    // Función para mostrar un toast de warning
    const notifyWarning = (message, options = {}) => {
        toast.warning(message, options);
    }
    return (
        <ToastContext.Provider value={{ notifySuccess, notifyError, notifyWarning }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
