import { apiFetch } from "../../utils/api.js";

export const cargarProductos = async () => {
    const contenedor = document.getElementById("listaProductos");

    try {
        const data = await apiFetch("/productos");

        console.log("DATA:", data);

        const productos = data.productos; 


        contenedor.innerHTML = `
         <div class="tabla-header">
        <h3>Lista de Productos</h3>
        <button onclick="agregarProducto()">+ Agregar Producto</button>
    </div>
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(p => `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.nombre}</td>
                            <td>$${p.precio}</td>
                            <td>
                <button onclick="editarProducto(${p.id})">Editar</button>
                <button class="delete" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("ERROR REAL:", error);
        contenedor.innerHTML = "Error al cargar productos";
    }
};