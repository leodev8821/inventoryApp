import { useState, useEffect } from 'react';

const useFetch = ({ endpoint = "/home", method = "GET", authorization = null, body = {} }) => {
  const [fetchRes, setFetchRes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const server = "localhost";
  const port = "3001";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

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
        };

        if (method !== "GET") {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(`http://${server}:${port}/trainingpro/v1${endpoint}`, fetchOptions);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setFetchRes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, authorization, body]);

  return { fetchRes, isLoading, error };
};

export default useFetch;