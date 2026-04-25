import AppError from "../utils/AppError.js";

const validateParams = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
        abortEarly: false
    });

    if (error) {
        const message = error.details.map(e => e.message).join(", ");
        return next(new AppError(message, 400));
    }

    req.params = value; 

    next();
};

export default validateParams;