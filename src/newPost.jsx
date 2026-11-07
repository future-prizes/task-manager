function NewPost(newPost) {

  async function newPost(event) {
    event.preventDefault();
    const taskForm = event.target;
    const newTaskURL = "/api/new-post";
    const newPostFormData = new FormData(taskForm);
    if (!taskForm.checkValidity()) {
      taskForm.checkValidity();
      return;
    }
    try {
      const result = await fetch(newTaskURL, {
        method: "POST",
        credentials:"include",
        body: newPostFormData,
      });
      if (!result.ok) {
        throw new Error("No response");
      } else {
        const response = await result.json();
        h3.textContent = response.message;
      }
    } catch (error) {
      return error.message;
    } finally {
      taskForm.reset();
    }
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          newPost(event);
        }}
      >
        <label>
          Title
          <input name = "title" type="text" required placeholder="title" />
        </label>

        <label>
          Description
          <input name = "description"type="test" required placeholder="description" />
        </label>

        <label>
          Status
          <select name="status" required >
            <option value="to do">to do</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label>
          Due date
          <input name="due_date"type="datetime-local" required/>
        </label>

        <button type="submit">Submit</button>
      </form>
      <h3></h3>
    </>
  );
}

export default NewPost;
