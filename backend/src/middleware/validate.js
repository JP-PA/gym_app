import AppError from "../utils/AppError.js";

const validate = (schema) => (req,res,next) =>{
    const {error, value} = schema.validate(req.body, { abortEarly : false});

    if(error){
        const message = error.details.map(e => e.message).join(",");
        return next(new AppError(message,400));
    }
    req.body = value;
    next();
};

export default validate;