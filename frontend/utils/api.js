export const apiFetch = async (url, options = {}) => {

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    });

    return response.json();
};