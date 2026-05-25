import { useState } from "react";
import { loginUser } from "../../services/auth.service.js";
import { RegisterUser } from "../../services/registre.service.js";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";

function Login() {

    const [isRegister, setIsRegister] = useState(false);

    const [Username, setUserName] = useState("")

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("");

    const navigate = useNavigate();
    const handleLogin = async () => {

        try {

            const data = await loginUser({
                correo: email,
                password
            });

            localStorage.setItem("token", data.token)

            setMessage("Login successful");
            setMessageType("success");
            

            navigate("/dashboard");
        } catch (error) {

            setMessage(
                error.response?.data?.message || "Unexpected error"
            );

            setMessageType("error");
            ;

        }


    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;
        }
        try {

            const data = await RegisterUser({
                nombre: Username,
                correo: email,
                password
            });

            console.log(data);

        } catch (error) {

            setMessage(
                error.response?.data?.mensaje || "Unexpected error"
            );

            setMessageType("error");
            ;

        }
    };

    return (
        <div className="Login-container">

            <h1>
                {isRegister ? "Register" : "Gym Login"}
            </h1>

            {isRegister && (
                <input type="text" placeholder="Username" value={Username} onChange={(e) => setUserName(e.target.value)} />
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {isRegister && (
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            )}
            {
                message && (
                    <div
                        className={`message ${messageType}`}
                    >
                        {message}
                    </div>
                )
            }
            <Button
                text={isRegister ? "Register" : "Login"}
                onClick={
                    isRegister
                        ? handleRegister
                        : handleLogin
                }
            />

            <p
                onClick={() => setIsRegister(!isRegister)}
                style={{
                    cursor: "pointer",
                    color: "orange"
                }}
            >
                {
                    isRegister
                        ? "Already have an account?"
                        : "Create account"
                }
            </p>

        </div>
    );
}

export default Login;