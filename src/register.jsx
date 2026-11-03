import {useState} from "react"

function Register() {
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
            placeholder="password"
            onChange={inputPass}
            />
        </label>
        
        <button type="submit">Submit</button>
        </form>
    )
}




export default Register