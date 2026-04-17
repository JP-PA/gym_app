import * as membresiaModel from "../models/membresias.model.js";

//  DURACIONES EN DÍAS
const DURACIONES = {
  "mensual": 30,
  "trimestral": 90,
  "semestral": 180,
  "anual": 365
};

// calcular fecha fin
const calcularFechaFin = (fechaInicio, tipo) => {
  const dias = DURACIONES[tipo];

  if (!dias) {
    throw new Error("Tipo de membresía no válido");
  }

  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + dias);

  return fecha;
};

// calcular estado
const calcularEstado = (fechaFin) => {
  const hoy = new Date();

  return new Date(fechaFin) >= hoy ? "activa" : "vencida";
};

//  CREAR MEMBRESÍA
const crearMembresia = async (data) => {
  const { tipo, precio, usuario_id } = data;

  if (!tipo || !DURACIONES[tipo]) {
    throw new Error("Tipo de membresía inválido");
  }

  if (!usuario_id) {
    throw new Error("Usuario requerido");
  }

  if (typeof precio !== "number") {
    throw new Error("Precio inválido");
  }

  const fecha_inicio = new Date();
  const fecha_fin = calcularFechaFin(fecha_inicio, tipo);
  const estado = calcularEstado(fecha_fin);

  return await membresiaModel.crearMembresias({
    tipo,
    precio,
    fecha_inicio,
    fecha_fin,
    estado,
    usuario_id
  });
};

// 📌 OBTENER TODAS
const obtenerMembresias = async () => {
  return await membresiaModel.obtenerTodasLasMembresias();
};

// 📌 OBTENER POR USUARIO
const obtenerMembresiaUsuario = async (usuario_id) => {
  return await membresiaModel.obtenerMembresia(usuario_id);
};

// 📌 ACTUALIZAR (recalcula todo)
const actualizarMembresia = async (id, data) => {
  const { tipo, precio, usuario_id } = data;

  if (!DURACIONES[tipo]) {
    throw new Error("Tipo inválido");
  }

  const fecha_inicio = new Date();
  const fecha_fin = calcularFechaFin(fecha_inicio, tipo);
  const estado = calcularEstado(fecha_fin);

  return await membresiaModel.actualizarMembresias({
    id,
    tipo,
    precio,
    fecha_inicio,
    fecha_fin,
    estado,
    usuario_id
  });
};

//  ELIMINAR
const eliminarMembresia = async (id) => {
  return await membresiaModel.eliminarMembresia(id);
};

export {
  crearMembresia,
  obtenerMembresias,
  obtenerMembresiaUsuario,
  actualizarMembresia,
  eliminarMembresia
};