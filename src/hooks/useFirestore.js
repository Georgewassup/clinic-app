import { useState, useEffect, useCallback } from 'react';

export function useFirestore(service) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.list();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const add = useCallback(async (item) => {
    const created = await service.create(item);
    setData((prev) => [...prev, created]);
    return created;
  }, [service]);

  const update = useCallback(async (id, item) => {
    await service.update(id, item);
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
  }, [service]);

  const remove = useCallback(async (id) => {
    await service.remove(id);
    setData((prev) => prev.filter((d) => d.id !== id));
  }, [service]);

  return { data, loading, error, add, update, remove, refresh: fetchAll };
}
