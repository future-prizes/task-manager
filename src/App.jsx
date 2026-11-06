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




  async function newPost(event) {

    event.preventDefault();
    const taskForm = event.target;
    const h1 = document.querySelector("h1");
    const newTaskURL = "/api/new-post";
    const newPostFormData = new FormData(taskForm);
    try {
      const result = await fetch(newTaskURL, {
        method: "POST",
        body: newPostFormData,
      });
      if (!result.ok) {
        throw new Error("No response");
      } else {
        const response = await result.json();
        h1.textContent = response;
      }
    } catch (error) {
      return error.message;
    }
    finally{
        taskForm.reset()
    }
    taskForm.reset();
  }

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
      <NewPost newPost = {newPost}/>
      <button onClick={showAll}>Show all</button>
      <h2></h2>

      <footer>
        <h6>&copy Future-Prizes, 2026</h6>
      </footer>
    </>
  );
}

export default App;
