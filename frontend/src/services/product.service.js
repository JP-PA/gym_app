import api from "./api.js";

export const GetProducts = async (params, signal) => {

    const response = await api.get("/productos", { params, signal });

    return response.data;
};
export const CreateProduct = async data => (await api.post("/productos", data)).data;
