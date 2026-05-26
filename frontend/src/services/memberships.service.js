import api from "./api.js";

export const GetMemberships = async () => {

    const response = await api.get("/membresias");

    return response.data;
};