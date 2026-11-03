import {useState} from "react"



function Login({registerRedirect, login}) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    

    function inputUser(e) {
        setUsername(e.target.value)
    }

    function inputPass(e) {
        setPassword(e.target.value)
    }


    return (
        <>
        <h3>Already registered? Sign in here</h3>
        <form onSubmit={(event)=>{login(event)}}>
        <label>Username
            <input
            value = {username}
            type="text" 
            required 
            placeholder="username"
            onChange={inputUser}
            />
        </label>
        
        <label>Password
            <input
            value = {password} 
            type="password"  
            required 
            placeholder="password"
            onChange={inputPass}
            />
        </label>
        
        <button type="submit">Submit</button>
        </form>

        <h4 onClick={registerRedirect}>Register</h4>
        </>
    )
}





export default Login


