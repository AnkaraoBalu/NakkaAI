import { useCallback, useEffect, useRef, useState } from "react";

// Loads data for a page and keeps it, its error and a loading flag. Calling
// `reload` fetches again; a result that arrives after a newer request is ignored.
export function useApiData<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const latest = useRef(0);

  // The caller lists what `load` depends on, like a useCallback.
  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    const id = ++latest.current;
    setLoading(true);
    try {
      const result = await run();
      if (id !== latest.current) return;
      setData(result);
      setError("");
    } catch (caught) {
      if (id !== latest.current) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    void reload();
    return () => {
      latest.current++;
    };
  }, [reload]);

  return { data, setData, error, loading, reload };
}
