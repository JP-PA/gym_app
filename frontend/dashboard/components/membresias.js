import { apiFetch } from "../../utils/api.js";

export const cargarMembresias = async () => {
    const contenedor = document.getElementById("listaMembresias");

    try {
        const data = await apiFetch("/membresias");

        contenedor.innerHTML = `
        <div class="tabla-header">
        <h3>Lista de membresias</h3>
        <button onclick="agregarMembresia()">+ Agregar Membresia</button>
    </div>
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(m => `
                        <tr>
                            <td>${m.id}</td>
                            <td>${m.tipo}</td>
                            <td>$${m.precio}</td>
                            <td>${m.estado}</td>
                            <td>${m.usuario_nombre}</td>
                            <td>
                <button onclick="editarProducto(${m.id})">Editar</button>
                <button class="delete" onclick="eliminarProducto(${m.id})">Eliminar</button>
            </td>
                        </tr>
                        
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        contenedor.innerHTML = "Error al cargar membresías";
    }
};