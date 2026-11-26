import api from "./api.js";

export const GetMemberships = async (params, signal) => {

    const response = await api.get("/membresias", { params, signal });

    return response.data;
};
export const CreateMembership = async data => (await api.post("/membresias", data)).data;

export const RenewMembership = async (id, data) => (await api.put(`/membresias/${id}`, data)).data;

export const GetExpiredMonthlyMemberships = (params, signal) =>
    GetMemberships({ ...params, estado: "vencida", tipo: "mensual" }, signal);
