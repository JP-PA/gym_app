const crearDetalleVenta = async (connectionDB,
    {
      venta_id,
      producto_id,
      cantidad,
      valor_unitario,
      subtotal}) => {
        const [result] = await connectionDB.query(`
        INSERT INTO detalle_ventas
        (
          venta_id,
          producto_id,
          cantidad,
          valor_unitario,
          subtotal
          ) 
        VALUES (?,?,?,?,?)`
        ,[
            venta_id,
            producto_id,
            cantidad,
            valor_unitario,
            subtotal])

        return {
            id : result.insertId,
            venta_id,
            producto_id,
            cantidad,
            valor_unitario,
            subtotal
        }
}


export {
    crearDetalleVenta
}