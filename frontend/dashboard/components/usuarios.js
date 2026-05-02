import { apiFetch } from "../../utils/api.js";

export const cargarUsuarios = async () => {
    const contenedor = document.getElementById("listaUsuarios");

    try {
        const data = await apiFetch("/usuarios");

        contenedor.innerHTML = `
        <div class="tabla-header">
        <h3>Lista de usuarios</h3>
        <button onclick="agregarUsuario()">+ Agregar Usuario</button>
    </div>
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>nombre</th>
                        <th>correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(u => `
                        <tr>
                            <td>${u.id}</td>
                            <td>${u.nombre}</td>
                            <td>${u.correo}</td>
                            <td>
                <button onclick="editarProducto(${u.id})">Editar</button>
                <button class="delete" onclick="eliminarProducto(${u.id})">Eliminar</button>
            </td>
                        </tr>
                        
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        contenedor.innerHTML = "Error al cargar Usuarios";
    }
};