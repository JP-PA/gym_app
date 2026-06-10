import { useEffect, useState } from "react";

import { GetUsers } from "../services/user.service";
import { GetProducts } from "../services/product.service";

function CrearVentaModal({
    open,
    onClose
}) {

    const [usuarios, setUsuarios] = useState([]);

    const [productos, setProductos] = useState([]);

    const [usuarioId, setUsuarioId] = useState("");

    const [productoId, setProductoId] = useState("");

    const [cantidad, setCantidad] = useState(1);

    const [detalleVenta, setDetalleVenta] = useState([]);

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const usuariosData =
                    await GetUsers();

                    setUsuarios(usuariosData);

                const productosData =
                    await GetProducts();
                    
                setProductos(productosData.productos);

                console.log(productosData)

            } catch (error) {

                console.error(error);

            }

        };

        cargarDatos();

    }, []);

    const agregarProducto = () => {

        if (!productoId || cantidad <= 0) {
            return;
        }

        const productoSeleccionado =
            productos.find(
                producto =>
                    producto.id ===
                    Number(productoId)
            );

        if (!productoSeleccionado) {
            return;
        }

        setDetalleVenta([
            ...detalleVenta,
            {
                producto_id:
                    Number(productoId),

                nombre:
                    productoSeleccionado.nombre,

                cantidad:
                    Number(cantidad)
            }
        ]);

        setProductoId("");

        setCantidad(1);

    };

    if (!open) {
        return null;
    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>Nueva Venta</h2>

                <div>

                    <label>
                        Usuario
                    </label>

                    <select
                        value={usuarioId}
                        onChange={(e) =>
                            setUsuarioId(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Seleccione un usuario
                        </option>

                        {
                            usuarios.map(
                                usuario => (

                                    <option
                                        key={usuario.id}
                                        value={usuario.id}
                                    >
                                        {usuario.nombre}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>

                <hr />

                <div>

                    <label>
                        Producto
                    </label>

                    <select
                        value={productoId}
                        onChange={(e) =>
                            setProductoId(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Seleccione un producto
                        </option>

                        {
                            productos.map(
                                producto => (

                                    <option
                                        key={producto.id}
                                        value={producto.id}
                                    >
                                        {producto.nombre}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>

                <div>

                    <label>
                        Cantidad
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) =>
                            setCantidad(
                                e.target.value
                            )
                        }
                    />

                </div>

                <button
                    onClick={agregarProducto}
                >
                    Agregar Producto
                </button>

                <h3>
                    Productos Agregados
                </h3>

                <table
                    className="detalle-table"
                >

                    <thead>

                        <tr>

                            <th>
                                Producto
                            </th>

                            <th>
                                Cantidad
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            detalleVenta.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={index}
                                    >

                                        <td>
                                            {
                                                item.nombre
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.cantidad
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >

                    <button
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CrearVentaModal;