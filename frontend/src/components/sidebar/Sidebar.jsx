import { NavLink, useNavigate } from "react-router-dom";
import { FaThLarge, FaUsers, FaBox, FaMoneyBillWave, FaTicketAlt, FaDumbbell, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";
const links = [["/dashboard", "Resumen", FaThLarge], ["/users", "Usuarios", FaUsers], ["/products", "Productos", FaBox], ["/sells", "Ventas", FaMoneyBillWave], ["/memberships", "Membresías", FaTicketAlt]];
export default function Sidebar() {
    const navigate = useNavigate();
    return <aside className="sidebar">
        <NavLink to="/dashboard" className="brand"><span className="brand-icon"><FaDumbbell /></span><span>GYM<span className="brand-accent">.</span><small>ADMINISTRACIÓN</small></span></NavLink>
        <p className="nav-caption">ESPACIO DE TRABAJO</p>
        <nav aria-label="Navegación principal"><ul>{links.map(([to, label, Icon]) => <li key={to}><NavLink to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Icon /><span>{label}</span></NavLink></li>)}</ul></nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><FaDumbbell /><strong>Cada día cuenta.</strong><p>Todo tu gimnasio, en un solo lugar.</p></div><button className="logout" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}><FaSignOutAlt /><span>Cerrar sesión</span></button></div>
    </aside>;
}
