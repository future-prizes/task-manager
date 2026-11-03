import {useState} from "react"



function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function inputUser(e) {
        setUsername(e.target.value)
    }

    function inputPass(e) {
        setPassword(e.target.value)
    }

    function submitter(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={submitter}>
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
    )
}





export default Login


