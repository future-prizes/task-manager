import Task from "./task"
import EmptyDash from "./emptyDash"
import { useState, useEffect, useRef } from "react"
import NewPost from "./newPost"


function Dashboard({user_id, tasks, setTasks}) {
    const originalTasks = useRef([{}])
    const [sortType, setSortType] = useState("due_date")
    const [sortDirection, setSortDirection] = useState("asc")
    const [searched, setSearched] = useState(null)
    const [searchMessage, setSearchMessage] = useState(null)
    

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

            originalTasks.current=fetchedTasks
            setTasks(fetchedTasks)
            
            console.log(fetchedTasks)
        }
        catch (error) {
            return error.message
        }
    }

    async function searchTasks(event) {
        event.preventDefault()
        const searchTasksURL = new URL("/api/search", window.location.origin)
        const searchFormData = new FormData(event.target)
        searchTasksURL.search = new URLSearchParams(searchFormData).toString()
        try {
        const result = await fetch(searchTasksURL, {
            method: "GET",
            credentials:"include",
            
        })
        if (!result.ok) {
            throw new Error("no response")
        }
        const fetchedSearch = await result.json()
        
        setSearched(fetchedSearch)
        }
        catch(error) {
            return error.message
        }
        }
    
    function resetSearch() {
        setSearched(null)
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
            sorted.sort((a,b) => {return (sortDirection ==="asc") ?
               (a.title.toLowerCase()).localeCompare(b.title.toLowerCase()) :
               (b.title.toLowerCase()).localeCompare(a.title.toLowerCase())
        })
        setTasks(sorted)
        }
        else if (sortType ==="status") {
            sorted.sort((a,b) => {return (sortDirection ==="asc") ? 
                (a.status.toLowerCase()).localeCompare(b.status.toLowerCase()) :
                (b.status.toLowerCase()).localeCompare(a.status.toLowerCase())
            })
        setTasks(sorted)
        }
        else if (sortType ==="due_date") {
            sorted.sort((a,b) => {return (sortDirection ==="asc") ? 
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
        setSortDirection("asc")
    }

    useEffect(()=>{sortTasks(sortType, sortDirection)}, [sortType, sortDirection])
    useEffect(()=>{loadTasks()}, [])

    return tasks.length !==0 ? (
    
        <div>
            <h1 className="mx-auto my-6 w-7/8 md:w-3/5 lg:w-1/2 text-center lg:text-4xl italic"id="title_box">Your tasks</h1>
            <h2 id="error_box"></h2>
        <section className="grid grid-cols-1 mx-auto md:w-4/5 xl:w-full xl:grid-cols-12 xl:gap-4">
            
        <details className=" lg:col-span-3 mx-auto ">
            <summary>
                Sort by title, status or due date
            </summary>
            <div className="flex flex-col gap-6">
            
            <select value={sortType} className="lg:text-xl mt-3"onChange={(e) =>{handleType(e)}}name="sort">
                <option value="due_date">Due date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
            </select>
            
            <select value={sortDirection} className="lg:text-xl" onChange={(e)=>{handleDirection(e)}} name="direction">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            
            </select>
            <button className="cursor-pointer hover:scale-115 transition duration-250 lg:text-xl"
            onClick={resetSort}>Reset</button>
            </div>
        </details>
        <div className="lg:col-span-6 mx-auto flex flex-col w-full gap-8">
        <h2></h2>
        {!searched ?
        tasks.map((task, key) => (
            <Task 
            loadTasks = {loadTasks}
            key={key}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}
            task_id = {task.task_id}
            />
        )): searched.map((task,key) => (
            <Task 
            loadTasks = {loadTasks}
            key={key}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}
            task_id = {task.task_id}
            />
        )) }
        <NewPost loadTasks={loadTasks}/>
        </div>
        <aside id="search_box" className="flex flex-col lg:col-span-3 p-4 mx-auto inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm w-3/5 xl:w-7/8 lg:max-h-[30rem]">
            <h2 className="text-center text-3xl xl:text-xl">Search</h2>
            <form method="GET" className="flex flex-col my-6 gap-4" onSubmit={(e) => {searchTasks(e)}}>
            <div className="lg:text-xl ">
                
                <label className="text-2xl xl:text-xl flex items-center gap-4 cursor-pointer" >
                    <input className=" accent-rose-600 cursor-pointer" name="search"value="title"type="radio"/>Title</label>

                <label className="text-2xl xl:text-xl flex items-center gap-4 cursor-pointer">
                    <input className="accent-rose-600 cursor-pointer" name="search" value="description"type="radio"/>Description</label>

                <label className="text-2xl xl:text-xl flex items-center gap-4 cursor-pointer">
                    <input className="accent-rose-600 cursor-pointer" name="search" value="status"type="radio"/>Status</label>
 
                <label className="text-2xl xl:text-xl flex items-center gap-4 cursor-pointer">
                    <input className="accent-rose-600 cursor-pointer" name="search"value="due_date"type="radio"/>Due date</label>
            </div>
            <label className="text-2xl lg:text-xl flex flex-col gap-2 my-2">
            Search:
                <input name="search_query" placeholder="search"type="text"className="p-1 bg-sky-100 rounded-sm border-1 placeholder:italic "/>
            </label>
            <input className="text-xl cursor-pointer hover:scale-115 transition duration-250 lg:text-xl" type="submit"/>
            </form>
            <button onClick={resetSearch}className="text-xl cursor-pointer hover:scale-115 transition duration-250 lg:text-xl">Reset</button>
            <h3 id="search_message">{searchMessage}</h3>
        </aside>
        </section>
        
        
        
        </div>
        ) : (
            <>
            <EmptyDash/>
            <NewPost loadTasks={loadTasks}/>
            </>
        )
        
        
        
        
        
        
    

}




export default Dashboard