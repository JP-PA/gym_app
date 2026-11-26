import api from "./api.js";

export const GetUsers = async (params, signal) => {

    const response = await api.get("/usuarios", { params, signal });

    return response.data;
};
export const CreateUser = async data => (await api.post("/usuarios", data)).data;
