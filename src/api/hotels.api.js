import { apiFetch } from "./http";

export const HotelsAPI = {
  list: ({ city } = {}) => {
    const qs = city ? `?city=${encodeURIComponent(city)}` : "";
    return apiFetch(`/api/hotels${qs}`);
  },
  getById: (id) => apiFetch(`/api/hotels/${id}`),
  create: (payload) => apiFetch(`/api/hotels`, { method: "POST", body: payload }),
  put: (id, payload) => apiFetch(`/api/hotels/${id}`, { method: "PUT", body: payload }),
  patch: (id, payload) => apiFetch(`/api/hotels/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => apiFetch(`/api/hotels/${id}`, { method: "DELETE" })
};
