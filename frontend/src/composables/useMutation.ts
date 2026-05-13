import { useCallback, useState } from "react";
import { extractApiError } from "../utils/errorHandler";

type MutationState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors?: Record<string, string[]>;
};

export function useMutation<TData, TVariables>(
  mutator: (variables: TVariables) => Promise<TData>,
) {
  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    loading: false,
    error: null,
    validationErrors: undefined,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        validationErrors: undefined,
      }));
      try {
        const data = await mutator(variables);
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
        throw error;
      }
    },
    [mutator],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      validationErrors: undefined,
    });
  }, []);

  return { ...state, mutate, reset };
}
