import useAuth from "../../auth/useAuth.js";
import { NavLink, useNavigate } from "react-router-dom";
import { FaThLarge, FaUsers, FaBox, FaMoneyBillWave, FaTicketAlt, FaDumbbell, FaSignOutAlt, FaBell } from "react-icons/fa";
import "./Sidebar.css";
const links = [["/dashboard", "Resumen", FaThLarge], ["/users", "Usuarios", FaUsers], ["/products", "Productos", FaBox], ["/sells", "Ventas", FaMoneyBillWave], ["/memberships", "Membresías", FaTicketAlt], ["/admin/notificaciones", "Notificaciones", FaBell]];
export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const admin = user?.role === "admin";
    const roleMenu = admin ? links : [["/mi", "Mi resumen", FaThLarge], ["/mi/perfil", "Mi perfil", FaUsers], ["/mi/membresias", "Mis membresías", FaTicketAlt], ["/mi/compras", "Mis compras", FaMoneyBillWave]];
    const menu = [...roleMenu, ["/rutinas", "Rutinas", FaDumbbell]];
    return <aside className="sidebar">
        <NavLink to={admin ? "/dashboard" : "/mi"} className="brand"><span className="brand-icon"><FaDumbbell /></span><span>GYM<span className="brand-accent">.</span><small>{admin ? "ADMINISTRACIÓN" : "MI ESPACIO"}</small></span></NavLink>
        <p className="nav-caption">MI GIMNASIO</p>
        <nav aria-label="Navegación principal"><ul>{menu.map(([to, label, Icon]) => <li key={to}><NavLink to={to} end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Icon /><span>{label}</span></NavLink></li>)}</ul></nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><FaDumbbell /><strong>Cada día cuenta.</strong><p>Todo tu gimnasio, en un solo lugar.</p></div><button className="logout" onClick={() => { logout(); navigate("/", { replace: true }); }}><FaSignOutAlt /><span>Cerrar sesión</span></button></div>
    </aside>;
}
