import { useCallback, useEffect, useState } from "react";
import type { ApiState } from "../types";
import { extractApiError } from "../utils/errorHandler";

type ApiStatus<T> = ApiState<T> & {
  validationErrors?: Record<string, string[]>;
};

interface UseApiOptions<T> {
  immediate?: boolean;
  initialData?: T | null;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {},
) {
  const { immediate = true, initialData = null } = options;
  const [state, setState] = useState<ApiStatus<T>>({
    data: initialData ?? undefined,
    loading: immediate,
    error: null,
    validationErrors: undefined,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      validationErrors: undefined,
    }));
    try {
      const data = await fetcher();
      setState({
        data,
        loading: false,
        error: null,
        validationErrors: undefined,
      });
      return data;
    } catch (error) {
      const parsed = extractApiError(error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: parsed.message,
        validationErrors: parsed.validationErrors,
      }));
      return undefined;
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
