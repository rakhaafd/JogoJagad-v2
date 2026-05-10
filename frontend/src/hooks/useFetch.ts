import { useCallback, useEffect, useState } from "react";
import type { ApiState } from "../types";
import { extractApiError } from "../utils/errorHandler";

export function useFetch<T>(fetcher: () => Promise<T>, immediate = true) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const parsed = extractApiError(error);
      setState((prev) => ({ ...prev, loading: false, error: parsed.message }));
      throw error;
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch: execute,
  };
}
