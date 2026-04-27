
import { apiFetch } from "../../utils/api.js";

export const cargarAdmin = async () => {
    const contenedor = document.getElementById("adminContenido");

    contenedor.innerHTML = "Cargando...";

    try {
        const data = await apiFetch("/usuarios");

        contenedor.innerHTML = `
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(u => `
                        <tr>
                            <td>${u.id}</td>
                            <td>${u.nombre}</td>
                            <td>${u.correo}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        contenedor.innerHTML = "Error al cargar usuarios";
    }
};