import api from "./api.js"

export const RegisterUser = async(datauser)=> {
    const response = await api.post(
        "/usuarios",
        datauser
    );

    return response.data
}