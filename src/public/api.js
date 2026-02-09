const API_BASE =
  (typeof window !== "undefined" && window.__API_BASE__) ||
  (typeof window !== "undefined" ? window.location.origin : "");

function getToken() {
  return sessionStorage.getItem("token");
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: "Bearer " + t } : {};
}
function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}


async function api(path, { method = "GET", body } = {}) {
  const headers = {
    ...authHeaders()
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    sessionStorage.removeItem("token");
    showToast("Session expired. Please login again.");
    setTimeout(() => location.href = "./index.html", 1000);
    return;
  }

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

function showToast(message, type = "error") {
  const t = document.getElementById("toast");
  if (!t) return alert(message);

  t.textContent = message;
  t.className = `toast ${type}`;
  t.classList.remove("hidden");

  setTimeout(() => {
    t.classList.add("hidden");
  }, 3000);
}
