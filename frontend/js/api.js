// API client
const API_BASE = "https://naijamart-api-5ti7.onrender.com";

function getToken() {
  return localStorage.getItem("nm_token");
}
function setToken(t) {
  localStorage.setItem("nm_token", t);
}
function clearToken() {
  localStorage.removeItem("nm_token");
  localStorage.removeItem("nm_user");
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("nm_user") || "null");
  } catch {
    return null;
  }
}
function setUser(u) {
  localStorage.setItem("nm_user", JSON.stringify(u));
}

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  // Only add JSON header if body is NOT FormData
  if (
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message)) ||
        `Request failed (${res.status})`;

      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    return data;
  } catch (err) {
    // network failure → fall through to caller
    throw err;
  }
}

function safeJson(t) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

const API = {
  base: API_BASE,
  login: (payload) => {
    const formData = new URLSearchParams();

    formData.append("username", payload.username);
    formData.append("password", payload.password);

    return apiFetch("/auth/login", {
      method: "POST",
      body: formData,
    });
  },
  register: (payload) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listProducts: () => apiFetch("/products"),
  listProductsForSeller: () => apiFetch("/products/seller"),
  createProduct: (payload) =>
    apiFetch("/products", { method: "POST", body: JSON.stringify(payload) }),
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
};

window.API = API;
