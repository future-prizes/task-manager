import { useState } from "react";
import Dashboard from "./dashboard";
import NewPost from "./newPost";
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

  return (
    <>
      <header>
        <h1>Task Manager</h1>
      </header>
      {loggedIn===true ? <Dashboard loggedIn = {loggedIn} setLoggedIn={setLoggedIn} user_id={userId} setUserId = {setUserId} tasks={tasks} setTasks={setTasks}/> : <Landing setUserId={setUserId} setLoggedIn={setLoggedIn}/>}
      
      <button onClick={showAll}>Show all</button>
      <h2></h2>

      <footer>
        <h6>&copy Future-Prizes, 2026</h6>
      </footer>
    </>
  );
}

export default App;
