import Joi from "joi";
export const crearVentaSchema = Joi.object({
    usuario_id: Joi.number().integer().positive().required(),
    productos: Joi.array().items(Joi.object({
        producto_id: Joi.number().integer().positive().required(),
        cantidad: Joi.number().integer().min(1).max(1000000).required()
    })).min(1).max(100).required()
});
