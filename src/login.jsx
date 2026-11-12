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
        <section id="login-box "className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 p-8 flex flex-col sm:w-1/2 lg: 1/3 xl:w-1/4">
        <h3 className="text-center mb-6 text-2xl xl:text-lg" >Already registered? </h3>
        <h3 className="font-medium text-center mb-6 text-2xl xl:text-lg">Sign in here</h3>
        <form className="flex flex-col gap-2 m-6" method="POST" onSubmit={(event)=>{login(event)}}>
        <label className="flex flex-col gap-2" >Username
            <input className="p-2 bg-sky-100 rounded-sm border-1"
            name="username"
            type="text" 
            required 
            
            
            />
        </label>
        
        <label className="flex flex-col gap-2">Password
            <input className="p-2 bg-sky-100 rounded-sm border-1"
            name = "password" 
            type="password"  
            required 
            
            
            />
        </label>
        <div className="flex flex-col justify-evenly gap-5 m-8">
        <button className="font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 text-2xl xl:text-lg " type="submit">Submit</button>
        <h4 className="text-lg font-bold text-center underline">No account?</h4>
        <button className="font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 italic text-2xl xl:text-lg "onClick={(event)=>{registerRedirect(event)}}>Register</button>
        </div>
        </form>

        <h2>{loginMessage}</h2>

        
        </section>
    )
}





export default Login


