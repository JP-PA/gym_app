import SearchFilters from "../components/SearchFilters.jsx";
import RenewMembershipModal from "../components/RenewMembershipModal.jsx";
import { useState } from "react";
import CreateRecordModal from "../components/CreateRecordModal.jsx";
import Pagination from "../components/Pagination.jsx";
import usePaginatedList from "../hooks/usePaginatedList.js";



import DashboardLayout from "../layouts/dashboardlayout";

import { GetMemberships, GetExpiredMonthlyMemberships } from "../services/memberships.service";


function Memberships({ notifications = false }) {

    const [renewing, setRenewing] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [success, setSuccess] = useState("");
    const list = usePaginatedList(notifications ? GetExpiredMonthlyMemberships : GetMemberships);
    const { data: memberships, loading, error } = list;

    return (

        <DashboardLayout>
            {success && <p className="message success" role="status">{success}</p>}

            <div className="header-container">
                <div><h1>{notifications ? "Notificaciones" : "Membresías"}</h1><p className="page-description">{notifications ? "Mensualidades vencidas" : "Consulta los planes y la vigencia de las membresías."}</p></div>

                {!notifications && <button className="add-btn" onClick={() => { setSuccess(""); setShowCreate(true); }}>
                    + Nueva Membresía
                </button>}
            </div>



            {!notifications && <SearchFilters resource="memberships" list={list} />}
            {error && <p className="message error" role="alert">{list.errorMessage || "No se pudo cargar el listado."} <button onClick={list.retry}>Reintentar</button></p>}
            <div className="table-scroll" role="region" aria-label="Listado de membresías" tabIndex="0"><table className="memberships-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Usuario</th>

                        <th>Tipo</th>

                        <th>Precio</th>

                        <th>Fecha de inicio</th>

                        <th>Fecha de fin</th>

                        <th>Estado</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>
{loading && <tr><td colSpan={8} className="empty-state" role="status">Cargando registros…</td></tr>}
{!loading && !error && memberships.length === 0 && <tr><td colSpan={8} className="empty-state">{notifications ? "No hay mensualidades vencidas." : "No hay registros que coincidan con la búsqueda."}</td></tr>}

                    {
                        memberships.map((membresias) => (

                            <tr key={membresias.id}>

                                <td>{membresias.id}</td>

                                <td>{membresias.usuario_nombre}</td>

                                <td>{membresias.tipo}</td>

                                <td>{Number(membresias.precio).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>

                                <td>{new Date(membresias.fecha_inicio).toLocaleDateString()}</td>

                                <td>{new Date(membresias.fecha_fin).toLocaleDateString()}</td>

                                <td><span className={`status-pill ${membresias.estado === "vencida" ? "status-expired" : ""}`}>{membresias.estado}</span></td>

                                <td className="actions">

                                    {membresias.estado === "vencida" && <button className="renew-btn" onClick={() => { setSuccess(""); setRenewing(membresias); }} aria-label={`Renovar membresía de ${membresias.usuario_nombre}`}>Renovar</button>}

                                    {!notifications && <button className="delete-btn" aria-label="Eliminar registro">
                                        🗑️
                                    </button>}

                                </td>


                            </tr>

                        ))
                    }

                </tbody>

            </table></div>
            <Pagination {...list} />


            {showCreate && <CreateRecordModal kind="membership" onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); setSuccess("Registro guardado correctamente."); list.setPage(1); list.retry(); }} />}
            {renewing && <RenewMembershipModal membership={renewing} onClose={() => setRenewing(null)} onSuccess={() => { setRenewing(null); setSuccess("Membresía renovada correctamente. Ya está activa."); list.retry(); }} />}
        </DashboardLayout>
    );
}

export default Memberships;