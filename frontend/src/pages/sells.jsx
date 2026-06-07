import { useEffect, useState } from "react";
import { FaEye} from "react-icons/fa";
import { GetVentas,GetVentaId } from "../services/sell.service";
import DashboardLayout from "../layouts/dashboardlayout";
import "./sells.css";

function Ventas() {

    const [ventas, setVentas] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [loadingVenta, setLoadingVenta] = useState(false);

    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    useEffect(() => {

        const fetchVentas = async () => {

            try {

                const data = await GetVentas();

                setVentas(data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchVentas();

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

                <button className="add-btn">
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

            
    {
    showModal && ventaSeleccionada && (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">
                    <h2>
                        Detalle Venta #{ventaSeleccionada.id}
                    </h2>
                </div>

                <div className="venta-info">

                    <div>
                        <span>Usuario</span>
                        <strong>
                            {ventaSeleccionada.nombre_usuario}
                        </strong>
                    </div>

                    <div>
                        <span>Fecha</span>
                        <strong>
                            {
                                new Date(
                                    ventaSeleccionada.fecha
                                ).toLocaleDateString()
                            }
                        </strong>
                    </div>

                    <div>
                        <span>Total</span>
                        <strong>
                            $
                            {
                                Number(
                                    ventaSeleccionada.total
                                ).toLocaleString()
                            }
                        </strong>
                    </div>

                </div>

                <h3>Productos Comprados</h3>

                <table className="detalle-table">

                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Valor Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            ventaSeleccionada.productos?.map(
                                (producto, index) => (

                                    <tr key={index}>

                                        <td>{producto.nombre}</td>

                                        <td>{producto.cantidad}</td>

                                        <td>
                                            $
                                            {
                                                Number(
                                                    producto.valor_unitario
                                                ).toLocaleString()
                                            }
                                        </td>

                                        <td>
                                            $
                                            {
                                                Number(
                                                    producto.subtotal
                                                ).toLocaleString()
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

                <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                >
                    Cerrar
                </button>

            </div>

        </div>

    )
}

        </DashboardLayout>

    );

}

export default Ventas;