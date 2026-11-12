import Task from "./task"
import EmptyDash from "./emptyDash"
import { useState, useEffect } from "react"
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
        

    useEffect(()=>{loadTasks()}, [])

    return (
        <section className="relative">
            <h2 id="error_box"></h2>
        {tasks.length ===0 ? <EmptyDash/>: ""}    
        {tasks.map((task, index) => (
            
            <Task 
            loadTasks = {loadTasks}
            key={index}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}
            task_id = {task.task_id}
            />
        ))}
        <NewPost loadTasks={loadTasks}/>
        <h2></h2>
        
        
        </section>
    )

}




export default Dashboard