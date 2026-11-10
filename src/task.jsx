function Editing({ title, description, due_date, handleEdit, task_id, editTask}) {
  return (
    <section>
      <form
        onSubmit={(event) => {
          editTask(event, task_id);
        }}
      >
        <label>
          Title
          <input defaultValue = {title} name="title" type="text" required placeholder="title" />
        </label>

        <label>
          Description
          <textarea
            defaultValue = {description}
            name="description"
            required
            placeholder="description"
          />
        </label>

        <label>
          Status
          <select name="status" required>
            <option value="to do">to do</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label>
          Due date
          <input defaultValue = {due_date}name="due_date" type="datetime-local" required />
        </label>

        <input type="submit" value="Save Changes"/>
      </form>
      <button onClick = {handleEdit}>Cancel</button>
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
