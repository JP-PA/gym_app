// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message);

    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Error interno del servidor"
    });
};

export default errorHandler;