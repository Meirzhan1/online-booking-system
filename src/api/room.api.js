import { apiFetch } from "./http";

function buildRoomsQuery({ hotelId, minPrice, maxPrice, isActive } = {}) {
  const params = new URLSearchParams();
  if (hotelId) params.set("hotelId", hotelId);
  if (minPrice !== undefined && minPrice !== "") params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined && maxPrice !== "") params.set("maxPrice", String(maxPrice));
  if (isActive !== undefined && isActive !== "") params.set("isActive", String(isActive));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const RoomsAPI = {
  list: (filters = {}) => apiFetch(`/api/rooms${buildRoomsQuery(filters)}`),
  getById: (id) => apiFetch(`/api/rooms/${id}`),
  create: (payload) => apiFetch(`/api/rooms`, { method: "POST", body: payload }),
  put: (id, payload) => apiFetch(`/api/rooms/${id}`, { method: "PUT", body: payload }),
  patch: (id, payload) => apiFetch(`/api/rooms/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => apiFetch(`/api/rooms/${id}`, { method: "DELETE" })
};
