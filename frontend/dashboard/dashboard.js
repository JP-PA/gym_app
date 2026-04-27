import { cargarProductos } from "./components/productos.js";
import { cargarMembresias } from "./components/membresias.js";
import { cargarAdmin } from "./components/admin.js";
import {cargarUsuarios} from "./components/usuarios.js"
import {cargarVentas} from "./components/ventas.js"
import { apiFetch } from "../utils/api.js";
import {logout} from "../utils/auth.js"

window.mostrarSeccion = async (seccion) => {
    console.log("CLICK EN:", seccion); // 👈 DEBUG

    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(seccion).classList.add("active");

    if (seccion === "productos") {
        console.log("CARGANDO PRODUCTOS");
        await cargarProductos();
    }
    if (seccion === "usuarios") {
        console.log("CARGANDO PRODUCTOS");
        await cargarUsuarios();
    }
    if (seccion === "ventas") {
        console.log("CARGANDO PRODUCTOS");
        await cargarVentas();
    }

    if (seccion === "membresias") {
        console.log("CARGANDO MEMBRESIAS");
        await cargarMembresias();
    }

    if (seccion === "admin") {
        console.log("CARGANDO ADMIN");
        await cargarAdmin();
    }
};
window.eliminarProducto = async (id) => {
    const confirmar = confirm("¿Eliminar producto?");
    if (!confirmar) return;

    try {
        await apiFetch(`/productos/${id}`, {
            method: "DELETE"
        });

        alert("Producto eliminado");

        mostrarSeccion("productos"); // recarga
    } catch (error) {
        alert("Error al eliminar");
    }
};


window.editarProducto = (id) => {
    alert("Aquí abrirás modal de edición: " + id);
};

window.abrirModal = (titulo, html, onSubmit) => {
    document.getElementById("modalTitle").textContent = titulo;
    document.getElementById("formFields").innerHTML = html;

    const form = document.getElementById("modalForm");

    form.onsubmit = async (e) => {
        e.preventDefault();
        await onSubmit(new FormData(form));
    };

    document.getElementById("modal").classList.remove("hidden");
};

window.cerrarModal = () => {
    document.getElementById("modal").classList.add("hidden");
};

window.agregarMembresia = async () => {

    const usuariosData = await apiFetch("/usuarios");
    const usuarios = usuariosData.usuarios || usuariosData;

    const opcionesUsuarios = usuarios.map(u =>
        `<option value="${u.id}">${u.nombre}</option>`
    ).join("");

    const tipos = ["mensual", "trimestral", "semestral", "anual"];

    const opcionesTipos = tipos.map(t =>
        `<option value="${t}">${t}</option>`
    ).join("");

    abrirModal("Nueva Membresía", `
        <div class="form-group">
            <label>Tipo</label>
            <select name="tipo">${opcionesTipos}</select>
        </div>

        <div class="form-group">
            <label>Precio</label>
            <input name="precio" type="number" required />
        </div>

        <div class="form-group">
            <label>Usuario</label>
            <select name="usuario_id">${opcionesUsuarios}</select>
        </div>
    `,
    // 🔥 AQUÍ VA LA FUNCIÓN
    async (formData) => {

        const data = Object.fromEntries(formData.entries());

        await apiFetch("/membresias", {
            method: "POST",
            body: JSON.stringify(data)
        });

        cerrarModal();
        mostrarSeccion("membresias");
    });
};