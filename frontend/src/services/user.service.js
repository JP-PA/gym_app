import api from "./api.js";

export const GetUsers = async () => {

    const response = await api.get("/usuarios");

    return response.data;
};