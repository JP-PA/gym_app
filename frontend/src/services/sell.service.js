import Ventas from "../pages/sells.jsx";
import api from "./api.js";

export const GetVentas = async () => {

    const response = await api.get("/ventas");

    return response.data;
};

export const GetVentaId = async (id) => {
    
    const response = await api.get(`/ventas/ventas/${id}`) 

    return response.data;
}

export const CreateVenta = async (Venta) =>{

    const response = await api.post("/ventas",Venta);

    return response.data;

};