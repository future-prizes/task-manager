import Task from "./task"
import EmptyDash from "./emptyDash"
import { useState, useEffect, useRef } from "react"
import NewPost from "./newPost"


function Dashboard({user_id, tasks, setTasks}) {
    const originalTasks = useRef([{}])
    const [sortType, setSortType] = useState("")
    const [sortDirection, setSortDirection] = useState("asc")
    

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

    function handleDirection(event) {
        setSortDirection(event.target.value)
    }
        
    function sortTasks(sortType ,sortDirection) {
        let sorted = [...tasks]

        if (sortType ==="title") {
            sorted.sort((a,b) => {return (sortDirection ==="ascending") ?
               (a.title.toLowerCase()).localeCompare(b.title.toLowerCase()) :
               (b.title.toLowerCase()).localeCompare(a.title.toLowerCase())
        })
        setTasks(sorted)
        }
        else if (sortType ==="status") {
            sorted.sort((a,b) => {return (sortDirection ==="ascending") ? 
                (a.status.toLowerCase()).localeCompare(b.status.toLowerCase()) :
                (b.status.toLowerCase()).localeCompare(a.status.toLowerCase())
            })
        setTasks(sorted)
        }
        else if (sortType ==="due_date") {
            sorted.sort((a,b) => {return (sortDirection ==="ascending") ? 
                new Date(a.due_date.replace(" ", "T")) - new Date(b.due_date.replace(" ", "T")) :
                new Date(b.due_date.replace(" ", "T")) - new Date(a.due_date.replace(" ", "T"))
            })
        setTasks(sorted)
        }
    }

    function resetSort() {
        if (sortType) {
            setSortType("due_date")
        }
        setSortDirection("ascending")
    }

    useEffect(()=>{sortTasks(sortType, sortDirection)}, [sortType, sortDirection])
    useEffect(()=>{loadTasks()}, [])

    return tasks.length !==0 ? (
        <>
        <section className="relative">
            <h1 className="mx-auto my-6 w-7/8 md:w-3/5 lg:w-1/2 text-center lg:text-4xl italic"id="title_box">Your tasks</h1>
            <h2 id="error_box"></h2>
        <details className="mx-auto my-2 w-7/8 md:w-3/5 lg:w-1/2">
            <summary>
                Sort by title, status or due date
            </summary>
            <div className="flex gap-6">
            <label className="lg:text-xl"
            >Sort
            <select value={sortType} className="mx-4"onChange={(e) =>{handleType(e)}}name="sort">
                <option value="due_date">Due date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
            </select>
            </label>
            <select value={sortDirection} className="lg:text-xl mx-4" onChange={(e)=>{handleDirection(e)}} name="direction">
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
            
            </select>
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