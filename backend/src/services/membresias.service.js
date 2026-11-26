import { obtenerUsuario } from "../models/usuarios.model.js";
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

  if (!await obtenerUsuario(usuario_id)) throw new AppError("El cliente no existe", 404);

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
const obtenerMembresias = async (pagination) => {
  return await membresiaModel.obtenerTodasLasMembresias(pagination);
};

//  OBTENER POR USUARIO
const obtenerMembresiaUsuario = async (id) => {
  return await membresiaModel.obtenerMembresia(id);
};

// Renovar una membresía vencida conservando el cliente y su ID.
const actualizarMembresia = async (id, { tipo, precio }) => {
  if (!DURACIONES[tipo]) throw new AppError("Tipo de membresía inválido", 400);
  const actual = await membresiaModel.obtenerMembresia(id);
  if (!actual) throw new AppError("Membresía no encontrada", 404);
  if (actual.estado !== "vencida") throw new AppError("Solo se pueden renovar membresías vencidas", 409);

  const updated = await membresiaModel.actualizarMembresias({ id, tipo, precio, dias: DURACIONES[tipo] });
  if (!updated) throw new AppError("La membresía ya fue renovada o dejó de estar disponible. Actualiza el listado.", 409);
  return await membresiaModel.obtenerMembresia(id);
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