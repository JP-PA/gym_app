import VentaDetalleModal from "../components/VentaDetalleModel.jsx";
import CrearVentaModal from "../components/CrearVentaModal.jsx";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { GetVentas, GetVentaId } from "../services/sell.service";
import DashboardLayout from "../layouts/dashboardlayout";
import "./sells.css";

function Ventas() {

    const [ventas, setVentas] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [loadingVenta, setLoadingVenta] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    console.log(showCreateModal);

    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    useEffect(() => {
        let active = true;
        GetVentas().then(data => {
            if (active) setVentas(data);
        }).catch(console.error);
        return () => { active = false; };
    }, []);
    const handleView = async (id) => {

        try {

            setLoadingVenta(true);

            const venta = await GetVentaId(id);

            console.log(venta)

            setVentaSeleccionada(venta);

            setShowModal(true);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingVenta(false);

        }

    };

    return (

        <DashboardLayout>

            <div className="header-container">

                <div><h1>Ventas</h1><p className="page-description">Consulta el historial y los detalles de tus ventas.</p></div>

                <button
                    className="add-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Nueva Venta
                </button>

            </div>

            <div className="table-scroll" role="region" aria-label="Listado de ventas" tabIndex="0"><table className="ventas-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Usuario</th>

                        <th>Fecha</th>

                        <th>Total</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>
{ventas.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros para mostrar.</td></tr>}

                    {
                        ventas.map((venta) => (

                            <tr key={venta.id}>

                                <td>{venta.id}</td>

                                <td>{venta.nombre_usuario}</td>

                                <td>
                                    {
                                        new Date(
                                            venta.fecha
                                        ).toLocaleDateString()
                                    }
                                </td>

                                <td>
                                    ${venta.total}
                                </td>

                                <td className="actions">

                                    <button
                                        className="view-btn" aria-label="Ver detalle de venta"
                                        disabled={loadingVenta}
                                        onClick={() => handleView(venta.id)}
                                    >
                                        <FaEye />
                                    </button>


                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table></div>


            <VentaDetalleModal
                open={showModal}
                venta={ventaSeleccionada}
                onClose={() => setShowModal(false)}
            />

            <CrearVentaModal
                open={showCreateModal}
                onClose={()=>setShowCreateModal(false)}
            />

        </DashboardLayout>

    );

}

export default Ventas;