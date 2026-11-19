import { useLocation } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./Navbar.css";
const titles = {"/dashboard":"Resumen general", "/users":"Usuarios", "/products":"Productos", "/sells":"Ventas", "/memberships":"Membresías"};
export default function Navbar() {
    const { pathname } = useLocation();
    return <header className="navbar"><div className="breadcrumb">Mi gimnasio <span>/</span> <strong>{titles[pathname] || "Administración"}</strong></div><div className="navbar-right"><span className="today"><FaRegCalendarAlt />{new Date().toLocaleDateString("es-CO", {day:"numeric", month:"long", year:"numeric", timeZone:"America/Bogota"})}</span><span className="avatar" aria-label="Administración">AD</span></div></header>;
}
