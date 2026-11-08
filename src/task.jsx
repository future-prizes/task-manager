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
    
    <section>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
        <p>{status}</p>
        <p>{due_date}</p>
      </div>
      <div>
        <button onClick={handleEdit}>Edit</button>
        <button
          onClick={() => {deleteTask(task_id)}}>
          Delete
        </button>
      </div>
    </section>    
  );
}

export default Task;
