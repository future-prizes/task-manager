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
        <section className="mx-auto p-4 flex flex-col w-1/2">
        <h3 className="text-center m-4">Already registered? Sign in here</h3>
        <form className="flex flex-col justify-center items-center gap-2" method="POST" onSubmit={(event)=>{login(event)}}>
        <label  >Username
            <input className="m-4"
            name="username"
            type="text" 
            required 
            placeholder="username"
            
            />
        </label>
        
        <label>Password
            <input className="m-4"
            name = "password" 
            type="password"  
            required 
            placeholder="password"
            
            />
        </label>
        <div className="flex justify-evenly gap-4">
        <button className="cursor-pointer hover:text-gray-400 px-4 " type="submit">Submit</button>
        <button className="cursor-pointer hover:text-gray-400 px-4 "onClick={registerRedirect}>Register</button>
        </div>
        </form>

        <h2>{loginMessage}</h2>

        
        </section>
    )
}





export default Login


