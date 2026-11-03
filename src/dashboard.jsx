import Task from "./task"

function Dashboard({taskData}) {


    return (
        <>
        <div>
            <h2>Dashboard</h2>
        </div>        
        {taskData.map((task, index) => {
            <Task 
            key={index}
            title = {task.title}
            description = {task.description}
            status = {task.status}
            due_date = {task.due_date}>

            </Task>
        })}
        </>
    )

}




export default Dashboard