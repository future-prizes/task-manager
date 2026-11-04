import { useState } from "react";
import Login from "./login";
import Register from "./register";
import NewPost from "./newPost";
import Landing from "./landing";

function App() {
  const hostURL = "http://127.0.0.1/";
  const port = "5000";
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

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
        h2.textContent = response.error;
      } else if (response.all_good) {
        setUsername(response.user);
        setLoggedIn(true);
      }
    } catch (error) {
      return error.message;
    } finally {
      loginForm.reset();
    }
  }


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
      {loggedIn===true ? <Dashboard/> : <Landing login={login}/>}
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
