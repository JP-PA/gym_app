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
                <h1>productos</h1>

                <button className="add-btn">
                    + Nuevo Producto
                </button>
            </div>


            <table className="products-table">

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

                    {
                        products.map((producto) => (

                            <tr key={producto.id}>

                                <td>{producto.id}</td>

                                <td>{producto.nombre}</td>

                                <td>{producto.precio}</td>

                                <td>{producto.stock}</td>

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

export default Products;