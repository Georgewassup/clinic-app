const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const stockApi = {
  list: () => request('/stock'),
  get: (id) => request(`/stock/${id}`),
  create: (data) => request('/stock', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/stock/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/stock/${id}`, { method: 'DELETE' }),
};

export const adjustmentApi = {
  list: () => request('/stock/adjustments'),
  create: (data) => request('/stock/adjustments', { method: 'POST', body: JSON.stringify(data) }),
};

export const transferApi = {
  list: () => request('/stock/transfers'),
  create: (data) => request('/stock/transfers', { method: 'POST', body: JSON.stringify(data) }),
};

export const replenishmentApi = {
  list: () => request('/stock/replenishments'),
  create: (data) => request('/stock/replenishments', { method: 'POST', body: JSON.stringify(data) }),
};

export const historyApi = {
  list: (params) => request(`/stock/history?${new URLSearchParams(params)}`),
};
