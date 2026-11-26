import db from "../config/db.configuration.js";
import { queryFilteredPage } from "../utils/listFilters.js";
const connection = db.promise();

export function myMemberships(userId, pagination) {
    return queryFilteredPage(connection, "personalMemberships", `SELECT m.id, m.tipo, m.precio, m.fecha_inicio, m.fecha_fin,
        CASE WHEN m.fecha_fin >= CURDATE() THEN 'activa' ELSE 'vencida' END AS estado`,
        "FROM membresias m", "m.id DESC", pagination, userId);
}
export function myPurchases(userId, pagination) {
    return queryFilteredPage(connection, "personalPurchases", "SELECT v.id, v.fecha, v.total",
        "FROM ventas v", "v.id DESC", pagination, userId);
}
export async function myPurchase(userId, id) {
    const [rows] = await connection.query("SELECT id, fecha, total FROM ventas WHERE id = ? AND usuario_id = ?", [id, userId]);
    return rows[0] || null;
}
