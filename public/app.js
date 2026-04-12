const API = "/usuarios";

let token = "";

async function login() {
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ correo, password })
  });

  const data = await res.json();

  if (!data.token) {
    alert("Error de login");
    return;
  }

localStorage.setItem("token", data.token);
token = data.token;

  alert("Login exitoso");
}

// 👥 OBTENER USUARIOS
async function obtenerUsuarios() {

  const res = await fetch(API, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.nombre} - ${u.correo}`;
    lista.appendChild(li);
  });
}