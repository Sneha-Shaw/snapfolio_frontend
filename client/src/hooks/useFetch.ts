import { useCallback, useEffect, useRef, useState } from 'react';

interface UseFetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, error: null, isLoading: true });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    fetcherRef
      .current()
      .then((data) => setState({ data, error: null, isLoading: false }))
      .catch((error: Error) => setState({ data: null, error, isLoading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
