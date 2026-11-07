import Task from "./task"
import EmptyDash from "./emptyDash"
import { useEffect } from "react"
import NewPost from "./newPost"

function Dashboard({setLoggedIn, user_id, setUserId, tasks, setTasks}) {

    async function loadTasks(){
        console.log("calling load tasks")
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

            
            setTasks(fetchedTasks.map((task)=>({
                task_id: task.id,
                title: task.title,
                description : task.description,
                status: task.status,
                due_date:task.due_date
            })))
            console.log(fetchedTasks)
        }
        catch (error) {
            return error.message
        }
    } 

    async function deleteTask(task_id, user_id){
        const deleteURL = `/api/delete-task/${task_id}`
        try {

            const result = await fetch(deleteURL, {
                method: "DELETE",
                credentials: "include"
            })
            if (!result.ok) {
                throw new Error("no reponse")
            }
            const response = await result.json()
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
            due_date = {task.due_date}
            deleteTask = {deleteTask}
            task_id = {task.task_id}
            user_id = {user_id}>

            </Task>
        ))}
        <NewPost/>
        <h2></h2>
        <button onClick = {logout}>Logout</button>
        
        </>
    )

}




export default Dashboard