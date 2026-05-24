import { useState } from "react";
import "./login.css";
import Button from "../../components/Button.jsx"

function Login() {

    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="Login-container">

            <h1>
                {isRegister ? "Register" : "Gym Login"}
            </h1>

            {isRegister && (
                <input type="text" placeholder="Username" />
            )}

            <input type="text" placeholder="Email" />

            <input type="password" placeholder="Password" />

            {isRegister && (
                <input type="password" placeholder="Confirm Password" />
            )}

            <Button
                text={isRegister ? "Register" : "Login"}
            />

            <p
                onClick={() => setIsRegister(!isRegister)}
                style={{ cursor: "pointer", color: "orange" }}
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