import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/dashboardlayout";

import { GetMemberships} from "../services/memberships.service";

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

            <h1><strong>Membresias</strong></h1>

            
              <table className="memberships-table">

    <thead>

        <tr>

            <th>ID</th>

            <th>Usuario</th>

            <th>tipo</th>

            <th>Fecha_inicio</th>

            <th>Fecha_fin</th>

            <th>Estado</th>

        </tr>

    </thead>

    <tbody>

        {
            memberships.map((membresias) => (

                <tr key={membresias.id}>

                    <td>{membresias.id}</td>

                    <td>{membresias.usuario_nombre}</td>

                    <td>{membresias.tipo}</td>

                    <td>{membresias.fecha_inicio}</td>

                    <td>{membresias.fecha_fin}</td>

                    <td>{membresias.estado}</td>

                </tr>

            ))
        }

    </tbody>

</table>
            

        </DashboardLayout>
    );
}

export default Memberships;