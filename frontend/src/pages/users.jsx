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

            <h1><strong>Usuarios</strong></h1>

            {
              <table className="users-table">

    <thead>

        <tr>

            <th>ID</th>

            <th>Nombre</th>

            <th>Correo</th>

            <th>Fecha_creacion</th>

        </tr>

    </thead>

    <tbody>

        {
            users.map((usuario) => (

                <tr key={usuario.id}>

                    <td>{usuario.id}</td>

                    <td>{usuario.nombre}</td>

                    <td>{usuario.correo}</td>

                    <td>{usuario.created_at}</td>

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