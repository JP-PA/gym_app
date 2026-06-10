function VentaDetalleModal({
    open,
    venta,
    onClose
}) {

    if (!open || !venta) {
        return null;
    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">
                    <h2>
                        Detalle Venta #{venta.id}
                    </h2>
                </div>

                <div className="venta-info">

                    <div>
                        <span>Usuario</span>
                        <strong>
                            {venta.nombre_usuario}
                        </strong>
                    </div>

                    <div>
                        <span>Fecha</span>
                        <strong>
                            {
                                new Date(
                                    venta.fecha
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
                                    venta.total
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
                            venta.productos?.map(
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
                    onClick={() => onClose()}
                >
                    Cerrar
                </button>

            </div>

        </div>


    );

}

export default VentaDetalleModal;