import SearchFilters from "../components/SearchFilters.jsx";
import { useState } from "react";
import CreateRecordModal from "../components/CreateRecordModal.jsx";
import Pagination from "../components/Pagination.jsx";
import usePaginatedList from "../hooks/usePaginatedList.js";


import DashboardLayout from "../layouts/dashboardlayout";

import { GetUsers } from "../services/user.service";


function Usuarios() {

    const [showCreate, setShowCreate] = useState(false);
    const [success, setSuccess] = useState("");
    const list = usePaginatedList(GetUsers);
    const { data: users, loading, error } = list;

    return (

        <DashboardLayout>
            {success && <p className="message success" role="status">{success}</p>}

            <div className="header-container">
                <div><h1>Usuarios</h1><p className="page-description">Administra la comunidad de tu gimnasio.</p></div>

                <button className="add-btn" onClick={() => { setSuccess(""); setShowCreate(true); }}>
                    + Nuevo cliente
                </button>
            </div>

            <SearchFilters resource="users" list={list} />
            {error && <p className="message error" role="alert">{list.errorMessage || "No se pudo cargar el listado."} <button onClick={list.retry}>Reintentar</button></p>}
            <div className="table-scroll" role="region" aria-label="Listado de usuarios" tabIndex="0"><table className="users-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Nombre</th>

                            <th>Correo</th>

                            <th>Fecha de creación</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>
{loading && <tr><td colSpan={5} className="empty-state" role="status">Cargando registros…</td></tr>}
{!loading && !error && users.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros que coincidan con la búsqueda.</td></tr>}

                        {
                            users.map((usuario) => (

                                <tr key={usuario.id}>

                                    <td>{usuario.id}</td>

                                    <td>{usuario.nombre}</td>

                                    <td>{usuario.correo}</td>

                                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>

                                    <td className="actions">

                                        <button className="edit-btn" aria-label="Editar registro">
                                            ✏️
                                        </button>

                                        <button className="delete-btn" aria-label="Eliminar registro">
                                            🗑️
                                        </button>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table></div>
            <Pagination {...list} />

            {showCreate && <CreateRecordModal kind="user" onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); setSuccess("Registro guardado correctamente."); list.setPage(1); list.retry(); }} />}
        </DashboardLayout>
    );
}

export default Usuarios;