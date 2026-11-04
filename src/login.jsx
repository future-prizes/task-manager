import {useState} from "react"



function Login({registerRedirect, setLoggedIn, setUserId}) {

    const [loginMessage, setLoginMessage] = useState("")

    async function login(event) {
    event.preventDefault();

    const loginForm = event.target;

    const loginFormData = new FormData(loginForm);
    const loginURL = "/api/login";

    if (!loginForm.checkValidity()) {
      loginForm.checkValidity();
      return;
    }
    try {
      const result = await fetch(loginURL, {
        method: "POST",
        body: loginFormData,
        credentials: "include",
      });
      const response = await result.json();
      if (!result.ok) {
        setLoginMessage(response.error)
      } else if (response.ok) {
        setUserId(response.id);
        setLoggedIn(true);
      }
    } catch (error) {
        setLoginMessage(error.message)
      return error.message;
    } finally {
      loginForm.reset();
    }
  }

    return (
        <>
        <h3>Already registered? Sign in here</h3>
        <form onSubmit={(event)=>{login(event)}}>
        <label>Username
            <input
            name="username"
            type="text" 
            required 
            placeholder="username"
            
            />
        </label>
        
        <label>Password
            <input
            name = "password" 
            type="password"  
            required 
            placeholder="password"
            
            />
        </label>
        
        <button type="submit">Submit</button>
        </form>

        <h2>{loginMessage}</h2>

        <a onClick={registerRedirect}style={{color: "red"}}>Register</a>
        </>
    )
}





export default Login


