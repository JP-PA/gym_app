import Joi from "joi";
export const crearProductoSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(100).required(),
    precio: Joi.number().positive().precision(2).max(99999999.99).required(),
    stock: Joi.number().integer().min(0).max(2147483647).required()
});
