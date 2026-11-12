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
        <section className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 p-8 flex flex-col sm:w-1/2 lg: 1/3 xl:w-1/4">
        <h3 className="font-medium text-center mb-6 text-2xl xl:text-lg" >Enter your details here</h3>
        <form className="flex flex-col gap-2 m-6 " method="POST" onSubmit={(event)=>{register(event)}}>
        <label className="flex flex-col gap-2">Username
            <input
            className="p-2 bg-sky-100 rounded-sm border-1"
            name = "username"
            type="text" 
            required 
            placeholder="username"
            minLength={3}
            />
        </label>

        <label className="flex flex-col gap-2">Email
            <input
            className="p-2 bg-sky-100 rounded-sm border-1"
            name = "email"
            type="email"  
            required 
            placeholder="email"
            />
        </label>
        
        <label className="flex flex-col gap-2">Password
            <input
            className="p-2 bg-sky-100 rounded-sm border-1"
            name = "password"
            type="password"  
            required 
            minLength={6}
            placeholder="password"
            />
        </label>
        
        <button className="place-self-center mt-4 w-1/2 font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-1 py-2 rounded-lg active:bg-gray-500 active:text-sky-100 text-2xl xl:text-lg " type="submit">Submit</button>


        </form>
        <h2>{message}</h2>
        </section>
    )
}




export default Register