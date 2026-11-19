import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/dashboardlayout";

import { GetUsers } from "../services/user.service";

import "./users.css"

function Usuarios() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        const fetchUsers = async () => {

            try {

                const data = await GetUsers();

                console.log(data);

                setUsers(data);

            } catch (error) {

                console.error(error);

            }
        };

        fetchUsers();

    }, []);

    return (

        <DashboardLayout>

            <div className="header-container">
                <div><h1>Usuarios</h1><p className="page-description">Administra la comunidad de tu gimnasio.</p></div>

                <button className="add-btn">
                    + Nuevo Usuario
                </button>
            </div>

            {
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
{users.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros para mostrar.</td></tr>}

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
            }

        </DashboardLayout>
    );
}

export default Usuarios;