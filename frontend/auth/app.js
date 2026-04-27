const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        
        window.location.href = "../dashboard/dashboard.html";

    } catch (error) {
        document.getElementById("mensaje").textContent = error.message;
    }
});