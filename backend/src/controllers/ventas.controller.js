import { crearventacompleta,obtenerTodosLasVentas,obtenerVentaCompleta } from "../services/ventas.service.js"
import catchAsync from "../utils/catchAsync.js"

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

const obtenerTodasLasVentas = catchAsync(async(req,res)=> {
   
    const ventas = await obtenerTodosLasVentas();
    res.json(ventas)

}); 
const obtenerVentaPorId = async(req,res) => {

    try{

        const { id } = req.params;

        const venta =
            await obtenerVentaCompleta(id);

        if(!venta){

            return res.status(404).json({
                mensaje:"Venta no encontrada"
            });

        }

        res.json(venta);

    }catch(error){

        res.status(500).json({
            mensaje:error.message
        });

    }

};
    
export {
    crearVentaController,
    obtenerTodasLasVentas,
    obtenerVentaPorId
}
