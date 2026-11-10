import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import Landing from "./landing";

function App() {
  const hostURL = "http://127.0.0.1/";
  const port = "5000";
  const [loggedIn, setLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")
  const [tasks , setTasks] = useState([])


  // test functions
  async function showAll() {
    
    const fetchAllURL = "/api/show-all";
    try {
      const result = await fetch(fetchAllURL, {
        method: "GET",
      });
      if (!result.ok) {
        throw new Error("no response");
      }
      const response = await result.json();
      h2.textContent = response;
    } catch (error) {
      return error.message;
    }
  }

  async function api() {
    console.log("calling api")
    const apiURL = "/api/";
    try {
      const result = await fetch(apiURL, {
        method : "GET",
        credentials : "include"
      })
      if (!result.ok){
        throw new Error("no response")
      }
      else if (result.ok) {
        
      const response = await result.json()
      if (response.ok) {
      setLoggedIn(true)
      setUserId(response.user_id)
      }
      
    }
    } catch (error) {
      return error.message
    }
  }

  async function logout() {
        const logoutURL = "/api/logout"
        try {
            const result = await fetch(logoutURL, {
                method: "GET",
                credentials : "include"
            })
            if (!result.ok) {
                throw new Error("no response")
            }
            const response = await result.json()
            if (response. ok ===true) {
                setUserId("")
                setLoggedIn(false)
                h2.textContent = response.message
            }
        }
        catch (error) {
            return error.message
        }
    }

  useEffect(()=>{api()}, [])

  return (
    <main>
      
      <header className="flex items-center border-b-3 border-gray-600">
        <h1 className="ml-8 mt-6 text-3xl pb-2 pl-2 mb-4 border-l-2 border-gray-600 font-bold">Task Manager</h1>
        <div className="ml-auto flex mr-8 gap-6">
        {loggedIn && <button className="cursor-pointer hover:scale-115 transition duration-250"onClick = {logout}>Logout</button>}
        <a href="https://github.com/future-prizes"className ="block ml-auto w-10"><svg className=" hover:fill-mist-500  fill-mist-700 " 
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM223.7 96c-88.4 0-159.7 72.2-159.7 160.6 0 69.4 44.1 126.9 103.4 148.4 8.4 3.1 16.6-2.5 16.6-10.9l0-25c-4.4 1.9-10 3.1-15 3.1-20.6 0-32.8-11.2-41.6-32.2-3.4-8.4-7.2-13.4-14.4-14.4-3.7-.3-5-1.9-5-3.8 0-3.7 6.2-6.6 12.5-6.6 9.1 0 16.9 5.6 25 17.2 6.2 9.1 12.8 13.1 20.6 13.1s12.8-2.8 20-10c5.3-5.3 9.4-10 13.1-13.1-41.3-5-70.3-34.7-70.3-73.1 0-15.6 5.6-32.5 15-43.8-4.1-10.3-3.4-32.2 1.2-41.2 12.5-1.6 29.4 5 39.4 14.1 11.9-3.7 24.4-5.6 39.7-5.6s27.8 1.9 39.1 5.3c9.7-8.8 26.9-15.3 39.4-13.8 4.4 8.4 5 30.3 .9 40.9 10 11.9 15.3 27.8 15.3 44.1 0 38.4-29.1 67.5-70.9 72.8 10.6 6.9 17.8 21.9 17.8 39.1l0 32.5c0 9.4 7.8 14.7 17.2 10.9 56.6-21.6 100.9-78.1 100.9-148.1 0-88.4-71.9-160.6-160.3-160.6z"/>
          </svg></a>
        </div>
        
         
      </header>
      <section id="AppSection"className="p-4">
      {loggedIn===true ? <Dashboard 
        loggedIn = {loggedIn} 
        setLoggedIn={setLoggedIn} 
        user_id={userId} 
        setUserId = {setUserId} 
        tasks={tasks} 
        setTasks={setTasks}
        /> 
      : <Landing setUserId={setUserId} setLoggedIn={setLoggedIn}/>}
      <h2></h2>
      </section>

      <footer className=" p-4">
        <h6 className=" text-center">&copy; Future-Prizes, 2026</h6>
      </footer>
    </main>
  );
}

export default App;
