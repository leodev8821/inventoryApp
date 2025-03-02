import { useState, useCallback } from 'react';

const useFetch = () => {
  const [fetchError, setFetchError] = useState(null);

  const fetchData = useCallback(async ({ endpoint = "/", method = "GET", authorization = null, body = null }) => {
    setFetchError(null);

    try {
      // Configuración de la URL base
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/inventory-app/v1";
      const normalizedAPI_URL = API_URL.replace(/\/$/, ''); // Elimina / final si existe
      const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const url = `${normalizedAPI_URL}${normalizedEndpoint}`;

      // Configuración de headers
      const headers = {
        "Content-Type": "application/json",
        ...(authorization && { Authorization: authorization }),
      };

      // Configuración de opciones de fetch
      const fetchOptions = {
        method,
        headers,
        ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
      };

      // Realiza la solicitud
      const response = await fetch(url, fetchOptions);

      // Verifica si la respuesta es válida
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {
        }
        throw new Error(errorMessage);
      }

      // Manejar respuestas sin contenido (ejemplo: código 204 No Content)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return null;
    } catch (err) {
      setFetchError(err.message);
      throw err;
    }
  }, []);

  return { fetchError, fetchData };
};

export default useFetch;
