import api from "./api.js"

export const loginUser = async (userdata) => {
    const response = await api.post(
        "/usuarios/login",
        userdata
    );

    return response.data
}