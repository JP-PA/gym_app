import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth.js";
export default function ProtectedRoute({ children, role }) {
    const { user, loading, error, retry, logout } = useAuth();
    if (loading) return <div className="empty-state" role="status">Comprobando tu sesión…</div>;
    if (error) return <div className="empty-state" role="alert">No se pudo comprobar tu sesión. <button onClick={retry}>Reintentar</button> <button onClick={logout}>Cerrar sesión</button></div>;
    if (!user) return <Navigate to="/" replace />;
    if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/dashboard" : "/mi"} replace />;
    return children;
}
