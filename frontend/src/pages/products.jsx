import SearchFilters from "../components/SearchFilters.jsx";
import { useState } from "react";
import CreateRecordModal from "../components/CreateRecordModal.jsx";
import Pagination from "../components/Pagination.jsx";
import usePaginatedList from "../hooks/usePaginatedList.js";


import DashboardLayout from "../layouts/dashboardlayout";

import { GetProducts } from "../services/product.service";


function Products() {

    const [showCreate, setShowCreate] = useState(false);
    const [success, setSuccess] = useState("");
    const list = usePaginatedList(GetProducts);
    const { data: products, loading, error } = list;

    return (

        <DashboardLayout>
            {success && <p className="message success" role="status">{success}</p>}

            <div className="header-container">
                <div><h1>Productos</h1><p className="page-description">Consulta tu catálogo, precios y existencias.</p></div>

                <button className="add-btn" onClick={() => { setSuccess(""); setShowCreate(true); }}>
                    + Nuevo Producto
                </button>
            </div>


            <SearchFilters resource="products" list={list} />
            {error && <p className="message error" role="alert">{list.errorMessage || "No se pudo cargar el listado."} <button onClick={list.retry}>Reintentar</button></p>}
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
{loading && <tr><td colSpan={5} className="empty-state" role="status">Cargando registros…</td></tr>}
{!loading && !error && products.length === 0 && <tr><td colSpan={5} className="empty-state">No hay registros que coincidan con la búsqueda.</td></tr>}

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
            <Pagination {...list} />


            {showCreate && <CreateRecordModal kind="product" onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); setSuccess("Registro guardado correctamente."); list.setPage(1); list.retry(); }} />}
        </DashboardLayout>
    );
}

export default Products;