import Joi from "joi";

export const crearMembresiaSchema = Joi.object({
    tipo: Joi.string().min(3).required().messages({
      "any.required": "el tipo de membresia es obligatorio"
    }),
    precio: Joi.number().positive().required().messages({
    "number.base": "El precio debe ser un número",
    "number.positive": "El precio debe ser mayor a 0",
    "any.required": "El precio es obligatorio"
    }),
    usuario_id : Joi.number().integer().required().messages({
    "number.base":"El id debe ser un numero",
    "number.positive": "El id debe ser mayor a 0",
    "any.required": "El id es obligatorio"
    })
});

export const actualizarMembresiaSchema = Joi.object({
    tipo: Joi.string().min(3).required().messages({
      "any.required": "el tipo de membresia es obligatorio"
    }),
    precio: Joi.number().positive().required().messages({
    "number.base": "El precio debe ser un número",
    "number.positive": "El precio debe ser mayor a 0",
    "any.required": "El precio es obligatorio"
    }),
    usuario_id : Joi.number().integer().required().messages({
    "number.base":"El id debe ser un numero",
    "number.positive": "El id debe ser mayor a 0",
    "any.required": "El id es obligatorio"
    })
});

export const idSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
    "number.base":"El id debe ser un numero",
    "number.positive": "El id debe ser mayor a 0",
    "any.required": "El id es obligatorio"
    })
});
