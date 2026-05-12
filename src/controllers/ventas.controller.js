import { crearventacompleta } from "../services/ventas.service.js"

const crearVentaController = async (req, res) => {

    try {

        const { usuario_id, productos } = req.body

        const venta = await crearventacompleta({
            usuario_id,
            productos
        })

        return res.status(201).json(venta)

    } catch(error){

        return res.status(400).json({
            message: error.message
        })
    }
}

export {
    crearVentaController
}
