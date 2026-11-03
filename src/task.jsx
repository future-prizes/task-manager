

function Task({title, description, status, due_date}){


    return (
        <section>
            <h4>{title}</h4>
            <p>{description}</p>
            <p>{status}</p>
            <p>{due_date}</p>
        </section>
    )

}






export default Task