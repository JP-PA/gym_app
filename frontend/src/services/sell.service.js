import api from "./api.js";

export const GetVentas = async (params, signal) => {

    const response = await api.get("/ventas", { params, signal });

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