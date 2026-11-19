import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaMoneyBillWave, FaTicketAlt, FaArrowRight, FaDumbbell } from "react-icons/fa";
import DashboardLayout from "../layouts/dashboardlayout";
import Card from "../components/card/Card.jsx";
import { GetUsers } from "../services/user.service";
import { GetProducts } from "../services/product.service";
import { GetMemberships } from "../services/memberships.service";
import { GetVentas } from "../services/sell.service";
export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        let active = true;
        Promise.all([GetUsers(), GetProducts(), GetMemberships(), GetVentas()]).then(([users, products, memberships, sales]) => {
            if (active) setStats({ users: users.length, products: products.productos.length, memberships: memberships.length, sales: sales.length });
        }).catch(() => { if (active) setError(true); });
        return () => { active = false; };
    }, []);
    const value = key => stats ? stats[key] : error ? "—" : "…";
    return <DashboardLayout>
        <div className="dashboard-welcome"><div><p className="eyebrow">TU GIMNASIO, EN MOVIMIENTO</p><h1>Todo listo para un gran día.</h1><p className="page-description">Una vista de lo que pasa en tu gimnasio.</p></div><span className="workspace-badge">Panel de administración</span></div>
        {error && <p className="message error" role="alert">No pudimos cargar el resumen. Revisa la conexión con el servidor y vuelve a cargar la página.</p>}
        <div className="cards-container" aria-live="polite">
            <Card title="Usuarios" value={value("users")} icon={<FaUsers />} note="Personas registradas" />
            <Card title="Ventas" value={value("sales")} icon={<FaMoneyBillWave />} note="Ventas registradas" />
            <Card title="Productos" value={value("products")} icon={<FaBox />} note="Productos en el catálogo" />
            <Card title="Membresías" value={value("memberships")} icon={<FaTicketAlt />} note="Membresías registradas" />
        </div>
        <section className="dashboard-section"><div className="section-heading"><h2>Tu día a día, más fácil</h2><span>Accesos rápidos</span></div><div className="quick-links">
            <Link to="/users" className="quick-link"><FaUsers /><div><strong>Conoce a tu comunidad</strong><p>Consulta los usuarios de tu gimnasio.</p></div><FaArrowRight /></Link>
            <Link to="/sells" className="quick-link"><FaMoneyBillWave /><div><strong>Gestiona tus ventas</strong><p>Revisa el movimiento de tu negocio.</p></div><FaArrowRight /></Link>
            <Link to="/memberships" className="quick-link"><FaTicketAlt /><div><strong>Revisa las membresías</strong><p>Consulta los planes de tus usuarios.</p></div><FaArrowRight /></Link>
        </div></section>
        <div className="dashboard-banner"><div><p className="eyebrow">MENOS ADMINISTRACIÓN. MÁS ENERGÍA.</p><h2>Concéntrate en hacer crecer tu gimnasio.</h2><p>Usuarios, productos, ventas y membresías conectados en un mismo espacio.</p></div><FaDumbbell /></div>
    </DashboardLayout>;
}
