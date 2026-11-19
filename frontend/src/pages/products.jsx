import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/dashboardlayout";

import { GetProducts } from "../services/product.service";

import "./products.css"

function Products() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const data = await GetProducts();



                setProducts(data.productos);

                console.log(data.productos);

            } catch (error) {

                console.error(error);

            }
        };

        fetchProducts();

    }, []);

    return (

        <DashboardLayout>

            <div className="header-container">
                <div><h1>Productos</h1><p className="page-description">Consulta tu catálogo, precios y existencias.</p></div>

                <button className="add-btn">
                    + Nuevo Producto
                </button>
            </div>


            <div className="table-scroll" role="region" aria-label="Listado de productos" tabIndex="0"><table className="products-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Nombre</th>

                        <th>Precio</th>

                        <th>Stock</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>
{products.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros para mostrar.</td></tr>}

                    {
                        products.map((producto) => (

                            <tr key={producto.id}>

                                <td>{producto.id}</td>

                                <td>{producto.nombre}</td>

                                <td>{producto.precio}</td>

                                <td>{producto.stock}</td>

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

export default Products;