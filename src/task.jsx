function Task({title, description, status, due_date, deleteTask, task_id, user_id}){

  console.log(task_id, user_id)

    return (
        <section>
            <div>
            <h4>{title}</h4>
            <p>{description}</p>
            <p>{status}</p>
            <p>{due_date}</p>
            </div>
            <div>
                <button >Edit</button>
                <button onClick={() => {deleteTask(task_id, user_id)}}>Delete</button>
            </div>
        </section>
    )

}

export default Task