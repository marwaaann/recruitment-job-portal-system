import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ----------------------------
// Get CSRF token from cookie
// ----------------------------
const getCsrfToken = () => {

    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="));

    return cookie
        ? decodeURIComponent(cookie.split("=")[1])
        : null;
};

// ----------------------------
// Fetch CSRF token from backend
// ----------------------------
const fetchCsrfToken = async () => {

    console.log("🔄 Fetching CSRF token...");

    await axios.get(
        "http://localhost:8080/api/csrf",
        {
            withCredentials: true,
        }
    );

    const token = getCsrfToken();

    console.log("✅ CSRF Cookie:", token);

    return token;
};

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
api.interceptors.request.use(

    async (config) => {

        const method = config.method?.toLowerCase();

        // Only state-changing requests need CSRF
        if (
            method === "post" ||
            method === "put" ||
            method === "delete" ||
            method === "patch"
        ) {

            let token = getCsrfToken();

            if (!token) {

                token = await fetchCsrfToken();

            }

            if (token) {

                config.headers["X-XSRF-TOKEN"] = token;

                console.log("📤 Sending CSRF:", token);

            }

        }

        return config;

    },

    (error) => Promise.reject(error)

);

export default api;