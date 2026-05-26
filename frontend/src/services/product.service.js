import api from "./api.js";

export const GetProducts = async () => {

    const response = await api.get("/productos");

    return response.data;
};