import Login from "./login"
import Register from "./register"
import {useState} from "react"


function Landing(login, register) {

    const [showRegister, setShowRegister] = useState(false)

    function registerRedirect() {
        if (showRegister === false){
        setShowRegister(true)
        }
        else if (showRegister === true) {
            setShowRegister(false)
        }
    }

    return (
        <>
        <h2>
            Welcome to Task Manager
        </h2>
        <div>
            <Login registerRedirect = {registerRedirect} login = {login}/>
            {showRegister && <Register registerRedirect = {registerRedirect} register={register} />}         
        </div>
        </>
    )
}


export default Landing