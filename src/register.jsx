import {useState} from "react"

function Register() {

    const [message, setMessage] = useState("")

    async function register(event) {
    event.preventDefault();
    const registerForm = event.target
    const registerFormData = new FormData(registerForm);
    const regiserURL = "/api/register";

    if (!registerForm.checkValidity()) {
      registerForm.checkValidity();
      return;
    }
    try {
      const result = await fetch(regiserURL, {
        method: "POST",
        body: registerFormData,
      });
      if (!result.ok) {
        throw new Error("no response");
      }
      const response = await result.json();
      if (response.message) {
        setMessage(response.message)
      }
      
      
    } catch (error) {
        setMessage(error.message)
        return error.message;
    } finally {
      registerForm.reset();
    }
  }

    return (
        <>
        <form onSubmit={(event)=>{register(event)}}>
        <label>Username
            <input
            name = "username"
            type="text" 
            required 
            placeholder="username"
            minLength={3}
            />
        </label>

        <label>Email
            <input
            name = "email"
            type="email"  
            required 
            placeholder="email"
            />
        </label>
        
        <label>Password
            <input
            name = "password"
            type="password"  
            required 
            minLength={6}
            placeholder="password"
            />
        </label>
        
        <button type="submit">Submit</button>


        </form>
        <h2>{message}</h2>
        </>
    )
}




export default Register