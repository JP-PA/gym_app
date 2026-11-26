import AppError from "./AppError.js";

export async function saveSale(connection, input, models) {
    try {
        await connection.beginTransaction();
        const usuario = await models.obtenerUsuario(input.usuario_id, connection);
        if (!usuario) throw new AppError("El cliente no existe", 404);
        const quantities = new Map();
        for (const item of input.productos) {
            quantities.set(item.producto_id, (quantities.get(item.producto_id) || 0) + item.cantidad);
        }
        const details = [];
        let totalCents = 0;
        // Stable lock order reduces deadlocks when two sales share products.
        for (const [producto_id, cantidad] of [...quantities].sort((a, b) => a[0] - b[0])) {
            const producto = await models.obtenerProductoPorId(producto_id, connection);
            if (!producto) throw new AppError("Uno de los productos ya no existe", 404);
            if (producto.stock < cantidad) throw new AppError(`Stock insuficiente para ${producto.nombre}`, 409);
            const cents = Math.round(Number(producto.precio) * 100);
            if (!Number.isSafeInteger(cents) || cents <= 0) throw new AppError("El producto no tiene un precio válido", 409);
            const subtotalCents = cents * cantidad;
            if (!Number.isSafeInteger(subtotalCents) || !Number.isSafeInteger(totalCents + subtotalCents) || totalCents + subtotalCents > 9999999999) {
                throw new AppError("El total de la venta excede el importe permitido", 400);
            }
            totalCents += subtotalCents;
            details.push({ producto_id, cantidad, valor_unitario: cents / 100, subtotal: subtotalCents / 100 });
        }
        const total = totalCents / 100;
        const venta = await models.crearVenta(connection, { usuario_id: input.usuario_id, total });
        for (const detail of details) {
            await models.crearDetalleVenta(connection, { venta_id: venta.id, ...detail });
            await models.actualizarStockProducto(connection, detail);
        }
        await connection.commit();
        return { message: "Venta registrada correctamente", venta_id: venta.id, total };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
