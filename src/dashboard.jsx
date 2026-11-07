import Task from "./task"
import EmptyDash from "./emptyDash"
import { useEffect } from "react"
import NewPost from "./newPost"

function Dashboard({setLoggedIn, user_id, setUserId, tasks, setTasks}) {

    async function loadTasks(){
        console.log(user_id)
        
        const loadTasksURL = `/api/load-tasks/${user_id}`
        try {
            const result = await fetch(loadTasksURL, {
                method :"GET",
                credentials : "include"
            })
            if (!result.ok) {
                throw new Error("no response")
            }
            const fetchedTasks = await result.json()
            console.log(fetchedTasks)
            
            setTasks(fetchedTasks.map((task)=>({
                title: task.title,
                description : task.description,
                status: task.status,
                due_date:task.due_date
            })))
            

        }
        catch (error) {
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
        

    useEffect(()=>{loadTasks()}, [])

    return (
        <>
        <div>
            <h2>Dashboard</h2>
        </div>    
        {tasks.length ===0 ? <EmptyDash/>: ""}    
        {tasks.map((task, index) => (
            <Task 
            key={index}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}>

            </Task>
        ))}
        <NewPost/>
        <h2></h2>
        <button onClick = {logout}>Logout</button>
        
        </>
    )

}




export default Dashboard