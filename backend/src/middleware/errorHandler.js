// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message);

    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Ya existe un registro con estos datos." });
    if (err.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ message: "El cliente o producto seleccionado ya no existe." });
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.statusCode ? err.message : "No fue posible guardar o consultar los datos. Inténtalo nuevamente."
    });
};

export default errorHandler;