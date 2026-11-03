import {useState} from "react"

function Register(register, registerRedirect) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    function inputUser(e) {
        setUsername(e.target.value)
    }

    function inputPass(e) {
        setPassword(e.target.value)
    }

    function inputEmail(e) {
        setEmail(e.target.value)
    }

    

    return (
        <>
        <form onSubmit={(event)=>{register(event)}}>
        <label>Username
            <input
            value = {username}
            type="text" 
            required 
            placeholder="username"
            minLength={3}
            onChange={inputUser}
            />
        </label>

        <label>Email
            <input
            value = {email} 
            type="email"  
            required 
            placeholder="email"
            onChange={inputEmail}
            />
        </label>
        
        <label>Password
            <input
            value = {password} 
            type="password"  
            required 
            minLength={6}
            placeholder="password"
            onChange={inputPass}
            />
        </label>
        
        <button type="submit">Submit</button>

        <h3 onClick = {registerRedirect}>Login</h3>


        </form>
        </>
    )
}




export default Register