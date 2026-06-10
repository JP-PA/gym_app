import VentaDetalleModal from "../components/VentaDetalleModel.jsx";
import CrearVentaModal from "../components/CrearVentaModal.jsx";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { GetVentas, GetVentaId, CreateVenta } from "../services/sell.service";
import DashboardLayout from "../layouts/dashboardlayout";
import "./sells.css";

function Ventas() {

    const [ventas, setVentas] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [loadingVenta, setLoadingVenta] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    console.log(showCreateModal);

    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    const cargarVentas = async () => {

        try {

            const data = await GetVentas();

            setVentas(data);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        cargarVentas();

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

                <h1>Ventas</h1>

                <button
                    className="add-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Nueva Venta
                </button>

            </div>

            <table className="ventas-table">

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
                                        className="view-btn"
                                        onClick={() => handleView(venta.id)}
                                    >
                                        <FaEye />
                                    </button>


                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>


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