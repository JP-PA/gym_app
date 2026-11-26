import api from "./api.js";
export const MyMemberships = async (params, signal) => (await api.get("/mi/membresias", { params, signal })).data;
export const MyPurchases = async (params, signal) => (await api.get("/mi/compras", { params, signal })).data;
export const MyPurchase = async id => (await api.get(`/mi/compras/${id}`)).data;
