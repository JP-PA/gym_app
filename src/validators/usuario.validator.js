import Joi from "joi";

export const crearUsuarioSchema = Joi.object({
    nombre: Joi.string().min(4).required().trim().pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).messages({
         "string.empty": "El nombre no puede estar vacío",
            "string.min": "El nombre no puede ser tan corto",
            "string.pattern.base": "El nombre solo puede contener letras y espacios",
            "any.required": "El nombre es obligatorio"
    }),
    correo: Joi.string().email({ tlds: { allow: false } }).required().messages({
     "string.email": "Correo inválido",
    "any.required": "El correo es obligatorio"
    }),
    password : Joi.string().min(8).max(40).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).required().messages({
    "string.pattern":"La contraseña debe tner mayusculas,minusculas numeros y un caracter especial",
    "string.min":" Minimo de 8 caracteres",
    "string.max":"Maximo a 40 caracteres",
    "any.required": "La contraseña es obligatoria"
    })
});

export const actualizarUsuarioSchema = Joi.object({
    nombre: Joi.string().min(4).trim().pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).messages({
      "string.pattern":"El formato del nombre es invalido",
      "string.min":"El nombre no puede ser tan corto",
      "any.required": "El Nombre es obligatorio"
    }),
    correo: Joi.string().email({ tlds: { allow: false } }).messages({
     "string.email": "Correo inválido",
    "any.required": "El correo es obligatorio"
    }),
    password : Joi.string().min(8).max(40).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/).messages({
    "string.pattern":"La contraseña debe tener mayusculas,minusculas,numeros y un caracter especial",
    "string.min":" Minimo de 8 caracteres",
    "string.max":" Maximo a 40 caracteres",
    "any.required": "La contraseña es obligatoria"
    })
});

export const idSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
    "number.base":"El id debe ser un numero",
    "number.positive": "El id debe ser mayor a 0",
    "any.required": "El id es obligatorio"
    })
});
