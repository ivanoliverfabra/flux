import { useCallback, useEffect, useState } from 'react';
import Flux, { FluxI, FluxOptions } from '..';

type PromiseType<T> = T extends Promise<infer U> ? U : T;

export const useFlux = <T extends keyof FluxI, K extends keyof FluxI[T]>(
	options: FluxOptions,
	fluxType: T,
  fluxFunction: K,
	fetchOnMount: boolean = true,
  // @ts-ignore
  args?: Parameters<FluxI[T][K]>,
) => {
  // @ts-ignore
  const [response, setResponse] = useState<PromiseType<ReturnType<FluxI[T][K]>> | null>(null);
  const [loading, setLoading] = useState<boolean>(fetchOnMount);

  // @ts-ignore
  const fetchData = useCallback(async (...newArgs: Parameters<FluxI[T][K]>) => {
    setLoading(true);
    try {
      const flux = new Flux(options);
      const finalArgs = newArgs.length ? newArgs || [] : args || [];

      // @ts-ignore
      const response = await flux[fluxType][fluxFunction](...finalArgs);
      setResponse(response);
    } catch (error: any) {
      setResponse({ status: "error", message: error.message } as any);
    } finally {
      setLoading(false);
    }
  }, [args, fluxType, fluxFunction]);

  useEffect(() => {
		if (fetchOnMount) fetchData(...(args || [] as any));
  }, []);

  return { response, loading, fetch: fetchData };
};