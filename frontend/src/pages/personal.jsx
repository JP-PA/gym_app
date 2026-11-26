import SearchFilters from "../components/SearchFilters.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import useAuth from "../auth/useAuth.js";
import DashboardLayout from "../layouts/dashboardlayout.jsx";
import Card from "../components/card/Card.jsx";
import Pagination from "../components/Pagination.jsx";
import VentaDetalleModal from "../components/VentaDetalleModel.jsx";
import usePaginatedList from "../hooks/usePaginatedList.js";
import { MyMemberships, MyPurchases, MyPurchase } from "../services/personal.service.js";
import { apiError } from "../services/api.js";
const money = value => Number(value).toLocaleString("es-CO", { style: "currency", currency: "COP" });
const date = value => value ? new Date(String(value).slice(0, 10) + "T12:00:00").toLocaleDateString("es-CO") : "—";

function Summary() {
    const { user } = useAuth();
    const [result, setResult] = useState(null);
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        Promise.all([MyMemberships({ page: 1, limit: 1 }, controller.signal), MyPurchases({ page: 1, limit: 1 }, controller.signal)]).then(([memberships, purchases]) => {
            if (!controller.signal.aborted) setResult({ memberships, purchases });
        }).catch(error => { if (!controller.signal.aborted) setResult({ error: apiError(error) }); });
        return () => controller.abort();
    }, [attempt]);
    return <><p className="eyebrow">TU ESPACIO PERSONAL</p><h1>Hola, {user.nombre}.</h1><p className="page-description">Consulta tus planes, tus compras y los datos de tu cuenta.</p>
        {result?.error && <p className="message error" role="alert">{result.error} <button onClick={() => setAttempt(value => value + 1)}>Reintentar</button></p>}
        <div className="cards-container"><Card title="Mis membresías" value={result?.memberships?.pagination.total ?? "—"} note="Planes registrados a tu nombre" icon={<FaTicketAlt />} /><Card title="Mis compras" value={result?.purchases?.pagination.total ?? "—"} note="Compras registradas a tu nombre" icon={<FaMoneyBillWave />} /></div>
        <div className="quick-links"><Link className="quick-link" to="/mi/perfil"><FaUsers /><div><strong>Mi perfil</strong><p>Consulta los datos de tu cuenta.</p></div></Link><Link className="quick-link" to="/mi/membresias"><FaTicketAlt /><div><strong>Mis membresías</strong><p>Consulta fechas y vigencia de tus planes.</p></div></Link><Link className="quick-link" to="/mi/compras"><FaMoneyBillWave /><div><strong>Mis compras</strong><p>Revisa el detalle de tus productos.</p></div></Link></div>
    </>;
}
function Profile() {
    const { user } = useAuth();
    return <><h1>Mi perfil</h1><p className="page-description">Estos son los datos de tu cuenta. Para solicitar cambios, contacta al administrador.</p><dl className="profile-details"><div><dt>Nombre</dt><dd>{user.nombre}</dd></div><div><dt>Correo electrónico</dt><dd>{user.correo}</dd></div><div><dt>Miembro desde</dt><dd>{date(user.created_at)}</dd></div></dl></>;
}
function PersonalList({ section }) {
    const { user } = useAuth();
    const membership = section === "membresias";
    const list = usePaginatedList(membership ? MyMemberships : MyPurchases);
    const [sale, setSale] = useState(null);
    const [detailError, setDetailError] = useState("");
    const [busy, setBusy] = useState(false);
    async function view(id) {
        setBusy(true); setDetailError("");
        try { setSale({ ...await MyPurchase(id), nombre_usuario: user.nombre }); }
        catch (error) { setDetailError(apiError(error)); }
        finally { setBusy(false); }
    }
    return <><h1>{membership ? "Mis membresías" : "Mis compras"}</h1><p className="page-description">{membership ? "Consulta tus planes y su vigencia. Las renovaciones se gestionan con el administrador." : "Consulta tus compras y el detalle de los productos."}</p>
        <SearchFilters resource={membership ? "personalMemberships" : "personalPurchases"} list={list} />
        {list.error && <p className="message error" role="alert">{list.errorMessage || "No se pudo cargar tu información."} <button onClick={list.retry}>Reintentar</button></p>}
        {detailError && <p className="message error" role="alert">{detailError}</p>}
        <div className="table-scroll personal-table"><table><thead>{membership ? <tr><th>Plan</th><th>Precio</th><th>Inicio</th><th>Vencimiento</th><th>Estado</th></tr> : <tr><th>Compra</th><th>Fecha</th><th>Total</th><th>Detalle</th></tr>}</thead><tbody>
        {list.loading && <tr><td colSpan={membership ? 5 : 4} className="empty-state" role="status">Cargando…</td></tr>}
        {!list.loading && !list.error && !list.data.length && <tr><td colSpan={membership ? 5 : 4} className="empty-state">No hay {membership ? "membresías" : "compras"} que coincidan con los filtros.</td></tr>}
        {list.data.map(item => membership ? <tr key={item.id}><td>{item.tipo}</td><td>{money(item.precio)}</td><td>{date(item.fecha_inicio)}</td><td>{date(item.fecha_fin)}</td><td><span className={`status-pill ${item.estado === "vencida" ? "status-expired" : ""}`}>{item.estado}</span></td></tr> : <tr key={item.id}><td>#{item.id}</td><td>{date(item.fecha)}</td><td>{money(item.total)}</td><td><button className="renew-btn" disabled={busy} onClick={() => view(item.id)}>Ver detalle</button></td></tr>)}
        </tbody></table></div><Pagination {...list} /><VentaDetalleModal open={!!sale} venta={sale} onClose={() => setSale(null)} />
    </>;
}
export default function Personal({ section }) {
    return <DashboardLayout>{section === "resumen" ? <Summary /> : section === "perfil" ? <Profile /> : <PersonalList section={section} />}</DashboardLayout>;
}
