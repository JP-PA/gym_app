import useAuth from "../../auth/useAuth.js";
import { Link, useLocation } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./Navbar.css";
const titles = {"/mi":"Mi resumen", "/mi/perfil":"Mi perfil", "/mi/membresias":"Mis membresías", "/mi/compras":"Mis compras","/dashboard":"Resumen general", "/users":"Usuarios", "/products":"Productos", "/sells":"Ventas", "/memberships":"Membresías", "/admin/notificaciones":"Notificaciones", "/rutinas":"Rutinas"};
export default function Navbar() {
    const { user } = useAuth();
    const initials = (user?.nombre || "Usuario").split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    const { pathname } = useLocation();
    return <header className="navbar"><div className="breadcrumb">Mi gimnasio <span>/</span> <strong>{titles[pathname] || "Administración"}</strong></div><div className="navbar-right"><span className="today"><FaRegCalendarAlt />{new Date().toLocaleDateString("es-CO", {day:"numeric", month:"long", year:"numeric", timeZone:"America/Bogota"})}</span>{user?.role === "admin"
        ? <Link className="avatar" to="/admin/notificaciones" aria-label="Notificaciones del administrador" title="Notificaciones">{initials}</Link>
        : <span className="avatar" aria-label={user?.nombre || "Usuario"}>{initials}</span>}</div></header>;
}
