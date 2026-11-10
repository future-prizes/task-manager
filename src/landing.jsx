import Login from "./login"
import Register from "./register"
import {useState} from "react"


function Landing({setLoggedIn, setUserId}) {

    const [showRegister, setShowRegister] = useState(false)

    function registerRedirect(event) {
        event.preventDefault()
        if (showRegister === false){
        setShowRegister(true)
        }
        else if (showRegister === true) {
            setShowRegister(false)
        }
    }

    return (
        <>
        <h2 className="text-4xl italic text-gray-700">
            Welcome to Task Manager
        </h2>
        <div>
            <Login registerRedirect = {registerRedirect} setUserId={setUserId} setLoggedIn={setLoggedIn}/>
            {showRegister && <Register registerRedirect = {registerRedirect} />}         
        </div>
        </>
    )
}


export default Landing