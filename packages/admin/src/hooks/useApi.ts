import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface ApiOptions {
  method?: 'GET' | 'POST';
  body?: any;
  headers?: Record<string, string>;
}

export function useApi<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (options: ApiOptions = {}) => {
      setLoading(true);
      setError(null);
      try {
        const config: AxiosRequestConfig = {
          url,
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
          ...(options.body ? { data: options.body } : {}),
        };
        const res = await axios(config);
        setData(res.data);
        return res.data;
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  return { data, loading, error, request };
}
