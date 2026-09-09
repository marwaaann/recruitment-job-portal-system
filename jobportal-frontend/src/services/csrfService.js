import api from "./api";

let csrfLoaded = false;

export const initializeCsrf = async () => {
    if (csrfLoaded) return;

    try {
        await api.get("/csrf");
        csrfLoaded = true;
        console.log("✅ CSRF initialized");
    } catch (err) {
        console.error(err);
    }
};