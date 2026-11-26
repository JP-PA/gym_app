import { parseListQuery } from "../utils/listFilters.js";
import { crearventacompleta,obtenerTodosLasVentas,obtenerVentaCompleta } from "../services/ventas.service.js"
import catchAsync from "../utils/catchAsync.js"

const crearVentaController = catchAsync(async (req, res) => {
    const venta = await crearventacompleta(req.body);
    res.status(201).json(venta);
});

const obtenerTodasLasVentas = catchAsync(async(req,res)=> {
   
    const ventas = await obtenerTodosLasVentas(parseListQuery(req.query, "sales"));
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
