import {useState} from "react"

function NewPost() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("")
    const [due, setDue] = useState("")

    function inputTitle(e) {
        setTitle(e.target.value)
    }

    function inputDescription(e) {
        setDescription(e.target.value)
    }

    function inputStatus(e) {
        setStatus(e.target.value)
    }

    function inputDue(e) {
        setDue(e.target.value)
    }

    function submitter(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={submitter}>
        <label>Title
            <input
            value = {title}
            type="text" 
            required 
            placeholder="title"
            onChange={inputTitle}
            />
        </label>

        <label>Description
            <input
            value = {description} 
            type="description"  
            required 
            placeholder="description"
            onChange={inputDescription}
            />
        </label>
        
        <label>Status
            <input
            value = {status} 
            type="status"  
            required 
            placeholder="status"
            onChange={inputStatus}
            />
        </label>

        <label>Due date
            <input
            value = {due} 
            type="due"  
            required 
            placeholder="due"
            onChange={inputDue}
            />
        </label>
        
        <button type="submit">Submit</button>
        </form>
    )
}




export default newPost