import Task from "./task"
import EmptyDash from "./emptyDash"
import { useState, useEffect, useRef } from "react"
import NewPost from "./newPost"

function Dashboard({user_id, tasks, setTasks}) {
    const originalTasks = useRef([{}])
    const [sortType, setSortType] = useState("")
    

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

            
            setTasks(fetchedTasks)
            originalTasks.current=fetchedTasks
            console.log(fetchedTasks)
        }
        catch (error) {
            return error.message
        }
    } 

    function handleType(event) {
        setSortType(event.target.value)
    }
        
    function sortTasks(sortType) {
        if (sortType ==="title") {
            let sorted = [...originalTasks.current].sort((a,b) => {
                const aTitle = a.title.toLowerCase()
                const bTitle = b.title.toLowerCase()
               return aTitle.localeCompare(bTitle)
        })
        setTasks(sorted)
        }
        else if (sortType ==="status") {
            
            let sorted = [...originalTasks.current].sort((a,b) => {
                
                const aStatus = a.status.toLowerCase()
                const bStatus = b.status.toLowerCase()
               return aStatus.localeCompare(bStatus)
            })
        setTasks(sorted)
        }
        else if (sortType ==="due_date") {
            let sorted = [...originalTasks.current].sort((a,b) => {
               return a.due_date - b.due_date
            })
        setTasks(sorted)
        }
        else if (sortType ==="") {
        setTasks(originalTasks.current)
        }
    }

    function resetSort() {
        if (sortType) {
            setSortType("")
        }
    }

    useEffect(()=>{sortTasks(sortType)}, [sortType])
    useEffect(()=>{loadTasks()}, [])

    return tasks.length !==0 ? (
        <>
        <section className="relative">
            <h2 id="error_box"></h2>
        <details className="mx-auto my-2 w-7/8 md:w-3/5 lg:w-1/2">
            <summary>
                Sort by title, status or due date
            </summary>
            <div className="flex gap-6">
            <label className="lg:text-xl"
            >Sort
            <select value={sortType} className="mx-4"onChange={(e) =>{handleType(e)}}name="sort">
                <option value="">-</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="due_date">Due date</option>
            </select>
            </label>
            <button className="cursor-pointer hover:scale-115 transition duration-250 lg:text-xl"
            onClick={resetSort}>Reset</button>
            </div>
        </details>
           
        {tasks.map((task, key) => (
            <Task 
            loadTasks = {loadTasks}
            key={key}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}
            task_id = {task.task_id}
            />
        ))}
        </section>
        <NewPost loadTasks={loadTasks}/>
        <h2></h2>
        
        </>
        ) : (
            <>
            <EmptyDash/>
            <NewPost loadTasks={loadTasks}/>
            </>
        )
        
        
        
        
        
        
    

}




export default Dashboard