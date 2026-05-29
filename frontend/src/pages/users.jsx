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
                <h1>Usuarios</h1>

                <button className="add-btn">
                    + Nuevo Usuario
                </button>
            </div>

            {
                <table className="users-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Nombre</th>

                            <th>Correo</th>

                            <th>Fecha_creacion</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            users.map((usuario) => (

                                <tr key={usuario.id}>

                                    <td>{usuario.id}</td>

                                    <td>{usuario.nombre}</td>

                                    <td>{usuario.correo}</td>

                                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>

                                    <td className="actions">

                                        <button className="edit-btn">
                                            ✏️
                                        </button>

                                        <button className="delete-btn">
                                            🗑️
                                        </button>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>
            }

        </DashboardLayout>
    );
}

export default Usuarios;