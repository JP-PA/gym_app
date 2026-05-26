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

            <h1><strong>Productos</strong></h1>

            
              <table className="products-table">

    <thead>

        <tr>

            <th>ID</th>

            <th>Nombre</th>

            <th>Precio</th>

            <th>Stock</th>

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

                </tr>

            ))
        }

    </tbody>

</table>
            

        </DashboardLayout>
    );
}

export default Products;