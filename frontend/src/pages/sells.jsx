import SearchFilters from "../components/SearchFilters.jsx";
import Pagination from "../components/Pagination.jsx";
import usePaginatedList from "../hooks/usePaginatedList.js";
import VentaDetalleModal from "../components/VentaDetalleModel.jsx";
import CrearVentaModal from "../components/CrearVentaModal.jsx";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { GetVentas, GetVentaId } from "../services/sell.service";
import DashboardLayout from "../layouts/dashboardlayout";

function Ventas() {

    const list = usePaginatedList(GetVentas);
    const { data: ventas, loading, error } = list;

    const [showModal, setShowModal] = useState(false);

    const [loadingVenta, setLoadingVenta] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [success, setSuccess] = useState("");

    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

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
            {success && <p className="message success" role="status">{success}</p>}

            <div className="header-container">

                <div><h1>Ventas</h1><p className="page-description">Consulta el historial y los detalles de tus ventas.</p></div>

                <button
                    className="add-btn"
                    onClick={() => { setSuccess(""); setShowCreateModal(true); }}
                >
                    + Nueva Venta
                </button>

            </div>

            <SearchFilters resource="sales" list={list} />
            {error && <p className="message error" role="alert">{list.errorMessage || "No se pudo cargar el listado."} <button onClick={list.retry}>Reintentar</button></p>}
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
{loading && <tr><td colSpan={5} className="empty-state" role="status">Cargando registros…</td></tr>}
{!loading && !error && ventas.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros que coincidan con la búsqueda.</td></tr>}

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
            <Pagination {...list} />


            <VentaDetalleModal
                open={showModal}
                venta={ventaSeleccionada}
                onClose={() => setShowModal(false)}
            />

            {showCreateModal && <CrearVentaModal
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => { setShowCreateModal(false); setSuccess("Venta registrada correctamente."); list.setPage(1); list.retry(); }}
            />}

        </DashboardLayout>

    );

}

export default Ventas;