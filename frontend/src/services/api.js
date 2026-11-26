import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000" });
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && error.config?.url !== "/usuarios/login") {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
});
export function apiError(error) {
    if (error.response?.status === 401) return "Tu sesión no es válida o ha vencido. Vuelve a iniciar sesión.";
    return error.response?.data?.message || error.response?.data?.mensaje || error.response?.data?.error || "No se pudo conectar con el servidor. Inténtalo nuevamente.";
}
export default api;
