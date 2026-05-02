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
        console.log("CARGANDO USUARIOS");
        await cargarUsuarios();
    }
    if (seccion === "ventas") {
        console.log("CARGANDO VENTAS");
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
window.eliminarMembresia = async (id) => {
    const confirmar = confirm("¿Eliminar membresía?");
    if (!confirmar) return;

    try {
        await apiFetch(`/membresias/${id}`, {
            method: "DELETE"
        });

        mostrarSeccion("membresias");
    } catch (error) {
        alert("Error al eliminar");
    }
};


window.editarMembresia = async (id) => {

    
    const data = await apiFetch(`/membresias/${id}`);
    const m = data.membresia || data;

    const usuariosData = await apiFetch("/usuarios");
    const usuarios = usuariosData.usuarios || usuariosData;

    // 🔥 3. opciones usuario (seleccionado)
    const opcionesUsuarios = usuarios.map(u => `
        <option value="${u.id}" ${u.id === m.usuario_id ? "selected" : ""}>
            ${u.nombre}
        </option>
    `).join("");

    // 🔥 4. tipos
    const tipos = ["mensual", "trimestral", "semestral", "anual"];

    const opcionesTipos = tipos.map(t => `
        <option value="${t}" ${t === m.tipo ? "selected" : ""}>
            ${t}
        </option>
    `).join("");

    // 🔥 5. abrir modal con datos
    abrirModal("Editar Membresía", `
        <div class="form-group">
            <label>Tipo</label>
            <select name="tipo">${opcionesTipos}</select>
        </div>

        <div class="form-group">
            <label>Precio</label>
            <input name="precio" type="number" value="${m.precio}" required />
        </div>

        <div class="form-group">
            <label>Usuario</label>
            <select name="usuario_id">${opcionesUsuarios}</select>
        </div>
    `,
    async (formData) => {

        const data = Object.fromEntries(formData.entries());

        await apiFetch(`/membresias/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });

        cerrarModal();
        mostrarSeccion("membresias");
    });
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