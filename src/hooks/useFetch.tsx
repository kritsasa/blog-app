/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(url: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<T>(url);
                setData(response.data);
                setLoading(false)

            } catch (err: any) {
                setError(err.message || 'Somthing wnet wrong');
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [url]);

    return { data, loading, error };
}