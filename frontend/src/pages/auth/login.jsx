import Button from "../../components/Button.jsx"
import "./login.css"

function login (){
    return(
        <div className="Login-container">

            <h1>Gym Login</h1>

            <input type="text" placeholder="Email"/>

            <input type="password" placeholder="password"/>

            <Button text= "Login" />

        </div>
    )
}

export default login