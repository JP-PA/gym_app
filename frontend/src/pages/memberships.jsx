import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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
                <h1>Membresias</h1>

                <button className="add-btn">
                    + Nuevo Membresia
                </button>
            </div>



            <table className="memberships-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Usuario</th>

                        <th>tipo</th>

                        <th>Fecha_inicio</th>

                        <th>Fecha_fin</th>

                        <th>Estado</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>

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


        </DashboardLayout>
    );
}

export default Memberships;