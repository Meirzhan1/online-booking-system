const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function parseError(res) {
  let msg = `Request failed: ${res.status}`;
  try {
    const data = await res.json();
    if (data?.error) msg = data.error;
  } catch {}
  return new Error(msg);
}

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
    
  });
  
  if (!res.ok) throw await parseError(res);

  if (res.status === 204) return null;

  return await res.json();
}
