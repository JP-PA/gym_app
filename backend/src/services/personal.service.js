import * as personal from "../models/personal.model.js";
import { obtenerDetalleVenta } from "../models/ventas.model.js";
import AppError from "../utils/AppError.js";
export const myMemberships = (userId, pagination) => personal.myMemberships(userId, pagination);
export const myPurchases = (userId, pagination) => personal.myPurchases(userId, pagination);
export async function myPurchase(userId, id) {
    const sale = await personal.myPurchase(userId, id);
    if (!sale) throw new AppError("Compra no encontrada", 404);
    return { ...sale, productos: await obtenerDetalleVenta(sale.id) };
}
