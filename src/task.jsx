import { useState } from "react";




function Editing({ title, description, due_date, handleEdit, task_id, editTask, loadTasks}) {

  async function editTask(event, task_id) {
        event.preventDefault()
        const editForm = event.target
        const editTaskURL = `/api/update-task/${task_id}`
        const editFormData = new FormData(event.target)
        if (!editForm.checkValidity()) {
            editForm.checkValidity();
            return;
            }
        try {
        const result = await fetch(editTaskURL, {
            method : "PATCH",
            credentials: "include",
            body: editFormData
        })
        if (!result.ok) {
            throw new Error("no response")
        }
        const response = await result.json()
        if (response.ok) {
            loadTasks()
            handleEdit()
        }}
        catch(error) {
            return error.message
        } 
    }

  return (
    <section className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 flex flex-col w-7/8 md:w-3/5 lg:w-1/2">
      <h3 className="mt-6 text-2xl italic text-center">Edit this task</h3>
      <form className="flex flex-col gap-5 m-6"
        onSubmit={(event) => {
          editTask(event, task_id);
        }}
      >
        <label className="flex basis-2/3 flex-col gap-2 ">
          Title
          <input className="p-2 bg-sky-100 rounded-sm border-1 placeholder:italic" defaultValue = {title} name="title" type="text" required placeholder="title" />
        </label>

        <label className="items-center flex flex-col text-center gap-2">
          Description
          <textarea className="p-2 bg-sky-100 rounded-sm border-1 w-full min-h-40 placeholder:italic" 
            defaultValue = {description}
            name="description"
            required
            placeholder="description"
          />
        </label>

        <label className="flex basis-1/3 grow flex-col gap-2">
          Status
          <select  className="p-2 bg-sky-100 rounded-sm border-1" name="status" required>
            <option value="to do">to do</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label className="lg:w-1/2 flex flex-col gap-2">
          Due date
          <input className="p-2 bg-sky-100 rounded-sm border-1" defaultValue = {due_date}name="due_date" type="datetime-local" required />
        </label>

        <input className="self-center w-1/2 font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 text-2xl " type="submit" value="Save Changes"/>
      </form>
      <button className="mb-6 self-center w-1/2 font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 text-2xl " onClick = {handleEdit}>Cancel</button>
    </section>
  );
}
function DeleteTask({task_id, handleDelete, loadTasks}) {


  async function deleteTask(task_id){
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
            if (response.ok) {
            loadTasks()
            handleDelete()
            }
        }
        catch (error) {
            return error.message
        }
    }

  return (
 
  <div className="flex ml-auto gap-4">
    <p className="lg:text-lg">Are you sure you want to delete this task?</p>

  <button className=" mr-4 cursor-pointer hover:scale-115 hover:text-red-500 transition duration-250 lg:text-lg"
    onClick={() => {deleteTask(task_id)}}>
    Delete
  </button>
  <button className="mr-4 cursor-pointer hover:scale-115 transition duration-250 lg:text-lg"
    onClick={() => {handleDelete()}}>
    Cancel
  </button>
  
  </div>
  )}


function Task({ title, description, status, due_date, task_id, deleteTask, editTask, loadTasks }) {
  const [toDelete, setToDelete] = useState(false)
  const [editing, setEditing] = useState(false)

  function handleEdit() {
  if (editing) {
    setEditing(false);
  } else {
    setEditing(true);
  }
  }
  
  function handleDelete() {
  if (toDelete) {
  setToDelete(false)
  }
  else {
    setToDelete(true)
  }
  }
  return editing ? (
    <Editing 
    title = {title}
    description = {description}
    due_date= {due_date}
    handleEdit = {handleEdit}
    task_id={task_id}
    editTask = {editTask}
    loadTasks = {loadTasks}

    />
  ) : (
    
    <section className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 flex flex-col w-7/8 md:w-3/5 lg:w-1/2">
      
      <div className="flex basis-2/3 flex-col gap-2 p-2 ">
      <h4 className="font-bold italic">{title}</h4>
        <p>{description}</p>
        <p><span className="font-bold italic">Status:</span> {status}</p>
        <p><span className="font-bold italic">Due Date:</span> {due_date}</p>
      </div>
      <div className="p-2 flex bg-gray-200 inset-shadow-sm inset-shadow-gray-800">
        <button className="ml-4 cursor-pointer hover:scale-115 transition duration-250 lg:text-lg"onClick={handleEdit}>Edit</button>
        {toDelete ? <DeleteTask loadTasks={loadTasks} task_id={task_id} deleteTask={deleteTask} handleDelete={handleDelete}/> : 
        <button className="ml-auto mr-4 cursor-pointer hover:scale-115 hover:text-red-500 transition duration-250 lg:text-lg"
          onClick={handleDelete}>
          Delete
        </button>}
      </div>
    </section>    
  );
}

export default Task;
