import jwt from "jsonwebtoken";
import { obtenerUsuario } from "../models/usuarios.model.js";
import { jwtSecret } from "../config/jwt.configuration.js";

export default async function authMiddleware(req, res, next) {
    const match = /^Bearer ([^ ]+)$/i.exec(req.headers.authorization || "");
    if (!match) return res.status(401).json({ message: "Sesión requerida" });
    let decoded;
    try {
        decoded = jwt.verify(match[1], jwtSecret(), { algorithms: ["HS256"] });
        if (!Number.isSafeInteger(decoded.id) || decoded.id < 1) throw new Error("Identidad inválida");
    } catch {
        return res.status(401).json({ message: "Sesión inválida o vencida" });
    }
    try {
        const user = await obtenerUsuario(decoded.id);
        if (!user) return res.status(401).json({ message: "La cuenta ya no está disponible" });
        req.user = { ...user, role: user.role === "admin" ? "admin" : "user" };
        next();
    } catch (error) { next(error); }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Esta operación requiere permisos de administrador" });
    next();
}
