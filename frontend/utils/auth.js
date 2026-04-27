export const isLogged = () => {
    return !!localStorage.getItem("token");
};

export const logout = () => {
    localStorage.clear();
    window.location.href = "../auth/index.html";
};