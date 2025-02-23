import { useState, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/inventory-app/v1";

const useFetch = () => {
  const [fetchError, setFetchError] = useState(null);

  const fetchData = useCallback(async ({ endpoint = "/", method = "GET", authorization = null, body = null }) => {
    setFetchError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (authorization) {
        headers["Authorization"] = authorization;
      }

      const fetchOptions = {
        method,
        headers,
        body: method !== "GET" && body ? JSON.stringify(body) : undefined,
      };

      const url = new URL(endpoint, API_URL);
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setFetchError(err.message);
      throw err;
    }
  }, []);

  return { fetchError, fetchData };
};

export default useFetch;