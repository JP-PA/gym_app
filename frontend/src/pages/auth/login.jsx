import { useState } from "react";
import useAuth from "../../auth/useAuth.js";
import { Navigate, useNavigate } from "react-router-dom";
import { FaDumbbell, FaArrowRight, FaCheck } from "react-icons/fa";
import { loginUser } from "../../services/auth.service.js";
import { RegisterUser } from "../../services/registre.service.js";
import "./login.css";

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();
    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setMessageType("error");
        if (isRegister && password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        try {
            if (isRegister) {
                await RegisterUser({ nombre: name, correo: email, password });
                setIsRegister(false);
                setPassword("");
                setConfirmPassword("");
                setMessage("Tu cuenta está lista. Inicia sesión para continuar.");
                setMessageType("success");
            } else {
                const data = await loginUser({ correo: email, password });
                auth.login(data);
                navigate(data.usuario.role === "admin" ? "/dashboard" : "/mi", { replace: true });
            }
        } catch (error) {
            setMessage(error.response?.data?.mensaje || error.response?.data?.message || "No fue posible continuar. Revisa tus datos y la conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }
    if (auth.loading) return <p className="empty-state" role="status">Comprobando tu sesión…</p>;
    if (auth.user) return <Navigate to={auth.user.role === "admin" ? "/dashboard" : "/mi"} replace />;
    return <main className="login-page">
        <section className="login-story"><div className="brand"><span className="brand-icon"><FaDumbbell /></span><span>GYM<span className="brand-accent">.</span><small>ADMINISTRACIÓN</small></span></div>
            <div className="story-content"><span className="story-tag">EL SIGUIENTE NIVEL DE TU GIMNASIO</span><h1>Más enfoque.<br />Más energía.<br /><span>Más posibilidades.</span></h1><p>El espacio donde tu gimnasio se organiza y tu comunidad crece.</p><div className="story-features"><span><FaCheck /> Usuarios y membresías</span><span><FaCheck /> Productos y ventas</span></div></div>
            <p className="story-footer">Cada gran resultado empieza con una buena gestión.</p><FaDumbbell className="story-decoration" aria-hidden="true" />
        </section>
        <section className="login-form-panel"><div className="Login-container"><p className="eyebrow">BIENVENIDO A TU ESPACIO</p><h2>{isRegister ? "Crea tu cuenta" : "Qué bueno verte de nuevo"}</h2><p className="login-subtitle">{isRegister ? "Completa tus datos para empezar." : "Ingresa tus datos para gestionar tu gimnasio."}</p>
            <form onSubmit={handleSubmit}>
                {isRegister && <label htmlFor="name">Nombre<input id="name" autoComplete="name" placeholder="Tu nombre" required value={name} onChange={e => setName(e.target.value)} /></label>}
                <label htmlFor="email">Correo electrónico<input id="email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" required value={email} onChange={e => setEmail(e.target.value)} /></label>
                <label htmlFor="password">Contraseña<input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Ingresa tu contraseña" required value={password} onChange={e => setPassword(e.target.value)} /></label>
                {isRegister && <label htmlFor="confirm">Confirma tu contraseña<input id="confirm" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></label>}
                {message && <p className={`message ${messageType}`} role="status">{message}</p>}
                <button className="login-submit" disabled={loading} type="submit">{loading ? "Un momento…" : isRegister ? "Crear cuenta" : "Iniciar sesión"}<FaArrowRight /></button>
            </form>
            <p className="login-switch">{isRegister ? "¿Ya tienes una cuenta?" : "¿Primera vez por aquí?"} <button type="button" disabled={loading} onClick={() => { setIsRegister(!isRegister); setMessage(""); }}>{isRegister ? "Inicia sesión" : "Crea una cuenta"}</button></p>
            <div className="login-footer">GYM · Tu gimnasio, en un solo lugar.</div>
        </div></section>
    </main>;
}
