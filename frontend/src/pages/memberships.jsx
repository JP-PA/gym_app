import { useEffect, useState } from "react";


import DashboardLayout from "../layouts/dashboardlayout";

import { GetMemberships } from "../services/memberships.service";

import "./memberships.css"

function Memberships() {

    const [memberships, setMemberships] = useState([]);

    useEffect(() => {

        const fetchMemberships = async () => {

            try {

                const data = await GetMemberships();



                setMemberships(data);

                console.log(data.membresias);

            } catch (error) {

                console.error(error);

            }
        };

        fetchMemberships();

    }, []);

    return (

        <DashboardLayout>

            <div className="header-container">
                <div><h1>Membresías</h1><p className="page-description">Consulta los planes y la vigencia de las membresías.</p></div>

                <button className="add-btn">
                    + Nueva Membresía
                </button>
            </div>



            <div className="table-scroll" role="region" aria-label="Listado de membresías" tabIndex="0"><table className="memberships-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Usuario</th>

                        <th>Tipo</th>

                        <th>Fecha de inicio</th>

                        <th>Fecha de fin</th>

                        <th>Estado</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>
{memberships.length === 0 && <tr><td colSpan={7} className="empty-state">No hay registros para mostrar.</td></tr>}

                    {
                        memberships.map((membresias) => (

                            <tr key={membresias.id}>

                                <td>{membresias.id}</td>

                                <td>{membresias.usuario_nombre}</td>

                                <td>{membresias.tipo}</td>

                                <td>{new Date(membresias.fecha_inicio).toLocaleDateString()}</td>

                                <td>{new Date(membresias.fecha_fin).toLocaleDateString()}</td>

                                <td>{membresias.estado}</td>

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


        </DashboardLayout>
    );
}

export default Memberships;