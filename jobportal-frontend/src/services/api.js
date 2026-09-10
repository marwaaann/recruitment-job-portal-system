import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const BASE_URL = `${API_ROOT}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------
// Get CSRF token from cookie
// ----------------------------
export const getCsrfToken = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

// ----------------------------
// Fetch CSRF token from backend
// ----------------------------
export const fetchCsrfToken = async () => {
  try {
    await axios.get(`${BASE_URL}/csrf`, {
      withCredentials: true,
    });
    return getCsrfToken();
  } catch (err) {
    console.warn("Could not fetch CSRF token:", err.message);
    return null;
  }
};

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    const path = config.url || "";

    const csrfExemptPath = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/csrf",
    ].some((endpoint) => path.endsWith(endpoint));

    // Attach stored token if available in user object
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const token = parsed?.accessToken || parsed?.token;
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }

    // Only state-changing requests need CSRF
    if (
      !csrfExemptPath &&
      ["post", "put", "delete", "patch"].includes(method)
    ) {
      let token = getCsrfToken();
      if (!token) {
        token = await fetchCsrfToken();
      }
      if (token) {
        config.headers["X-XSRF-TOKEN"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------
// RESPONSE INTERCEPTOR (401 Refresh)
// ----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not retry auth routes or requests that have already been retried
    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.token;
        if (newToken) {
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            parsed.token = newToken;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("user");
        if (window.location.pathname !== "/" && window.location.pathname !== "/register") {
          window.location.href = "/";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;