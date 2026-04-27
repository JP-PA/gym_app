import { apiFetch } from "../../utils/api.js";

export const cargarVentas = async () => {
    const contenedor = document.getElementById("listaventas");

    try {
        const data = await apiFetch("/ventas");

        contenedor.innerHTML = `
        <div class="tabla-header">
        <h3>Lista de ventas</h3>
        <button onclick="agregarVenta()">+ Agregar Venta</button>
    </div>
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>usuario_id</th>
                        <th>fecha/th>
                        <th>total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(v => `
                        <tr>
                            <td>${v.id}</td>
                            <td>${v.usuario_id}</td>
                            <td>$${v.fecha}</td>
                            <td>${v.total}</td>
                             <td>
                <button onclick="editarProducto(${v.id})">Editar</button>
                <button class="delete" onclick="eliminarProducto(${v.id})">Eliminar</button>
            </td>
                        </tr>
                       
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        contenedor.innerHTML = "Error al cargar ventas";
    }
};