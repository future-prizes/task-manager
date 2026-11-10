function Editing({ title, description, due_date, handleEdit, task_id, editTask}) {
  return (
    <section className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 p-8 flex flex-col w-1/2">
      <h3 className="text-2xl italic text-center">Edit this task</h3>
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

        <label className="w-1/2 flex flex-col gap-2">
          Due date
          <input className="p-2 bg-sky-100 rounded-sm border-1" defaultValue = {due_date}name="due_date" type="datetime-local" required />
        </label>

        <input className="mt-3 place-self-center w-1/3 text-xl font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 " type="submit" value="Save Changes"/>
      </form>
      <button className="mt-3 place-self-center w-1/3 text-xl font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 " onClick = {handleEdit}>Cancel</button>
    </section>
  );
}

function Task({ title, description, status, due_date, deleteTask, task_id, handleEdit, editing, editTask }) {

  return editing ? (
    <Editing 
    title = {title}
    description = {description}
    due_date= {due_date}
    handleEdit = {handleEdit}
    task_id={task_id}
    editTask = {editTask}

    />
  ) : (
    
    <section className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 flex flex-col w-1/2">
      
      <div className="flex basis-2/3 flex-col gap-2 p-2 ">
      <h4 className="font-bold italic">{title}</h4>
        <p>{description}</p>
        <p><span className="font-bold italic">Status:</span> {status}</p>
        <p><span className="font-bold italic">Due Date:</span> {due_date}</p>
      </div>
      <div className="p-2 flex bg-gray-200 inset-shadow-sm inset-shadow-gray-800">
        <button className="ml-4 cursor-pointer hover:scale-115 transition duration-250"onClick={handleEdit}>Edit</button>
        <button className="ml-auto mr-4 cursor-pointer hover:scale-115 hover:text-red-500 transition duration-250"
          onClick={() => {deleteTask(task_id)}}>
          Delete
        </button>
      </div>
    </section>    
  );
}

export default Task;
