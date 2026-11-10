function NewPost({loadTasks}) {

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
        const response = await result.json()
        loadTasks()
      }
    } catch (error) {
      return error.message;
    } finally {
      taskForm.reset();
    }
  }

  return (
    <div className="mx-auto w-1/4 ">
      <form className="flex flex-col justify-center items-center"
        onSubmit={(event) => {
          newPost(event);
        }}
      >
        <label className="text-center flex items-center w-full">
          Title
          <input className="ml-auto m-4" name = "title" type="text" required placeholder="title" />
        </label>
        
        <label className="items-center flex flex-col text-center w-full min-h-20">
          Description
          <textarea className="m-4 w-full" name = "description" required placeholder="description" />
        </label>
        

        <label className="items-center flex w-full">
          Status
          <select className="ml-auto m-4" name="status" required >
            <option value="to do">to do</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label className="items-center flex w-full">
          Due date
          <input className="ml-auto m-4"name="due_date"type="datetime-local" required/>
        </label>

        <button className="cursor-pointer hover:text-gray-400 px-4 mt-6" type="submit">Submit</button>
      </form>
      <h3></h3>
    </div>
  );
}

export default NewPost;
