import {useState} from "react"
import Login from "./login"
import Register from "./register"



function App() {




    return (
        <>
            <header>
                <h1>Task Manager</h1>
            </header>
                <Login/>
                <Register/>


            <footer>
                <h6>&copy Future-Prizes, 2026</h6>

            </footer>


        </>


    )
}

export default App
