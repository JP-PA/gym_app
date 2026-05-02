import * as membresiaModel from "../models/membresias.model.js";
import AppError from "../utils/AppError.js";

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
    throw new AppError("Tipo de membresía invalida",400);
  }

  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + dias);

  return fecha;
};


//  CREAR MEMBRESÍA
const crearMembresia = async (data) => {
  const { tipo, precio, usuario_id } = data;

  if (!tipo || !DURACIONES[tipo]) {
    throw new AppError("Tipo de membresía inválido",400);
  }

  const fecha_inicio = new Date();
  const fecha_fin = calcularFechaFin(fecha_inicio, tipo);


  return await membresiaModel.crearMembresias({
    tipo,
    precio,
    fecha_inicio,
    fecha_fin,
    usuario_id
  });
};

// OBTENER TODAS
const obtenerMembresias = async () => {
  return await membresiaModel.obtenerTodasLasMembresias();
};

//  OBTENER POR USUARIO
const obtenerMembresiaUsuario = async (id) => {
  return await membresiaModel.obtenerMembresia(id);
};

//  ACTUALIZAR (recalcula todo)
const actualizarMembresia = async (id, data) => {
  const { tipo, precio, usuario_id } = data;

  if (!DURACIONES[tipo]) {
    throw new AppError("Tipo inválido",400);
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