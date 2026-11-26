import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import api from "../services/api.js";

export default function AuthProvider({ children }) {
    const [session, setSession] = useState({ user: null, loading: !!localStorage.getItem("token"), error: false });
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        if (!localStorage.getItem("token")) return;
        const controller = new AbortController();
        api.get("/mi/perfil", { signal: controller.signal }).then(({ data }) => {
            if (!controller.signal.aborted) setSession({ user: data, loading: false, error: false });
        }).catch(error => {
            if (!controller.signal.aborted) setSession({ user: null, loading: false, error: error.response?.status !== 401 });
        });
        return () => controller.abort();
    }, [attempt]);
    function logout() { localStorage.removeItem("token"); setSession({ user: null, loading: false, error: false }); }
    useEffect(() => {
        const expired = () => { localStorage.removeItem("token"); setSession({ user: null, loading: false, error: false }); };
        window.addEventListener("session-expired", expired);
        return () => window.removeEventListener("session-expired", expired);
    }, []);
    function login(data) {
        localStorage.setItem("token", data.token);
        setSession({ user: data.usuario, loading: false, error: false });
    }
    function retry() { setSession({ user: null, loading: true, error: false }); setAttempt(value => value + 1); }
    return <AuthContext.Provider value={{ ...session, login, logout, retry }}>{children}</AuthContext.Provider>;
}
