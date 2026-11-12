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
    <div className="inset-shadow-sm inset-shadow-gray-800 bg-gray-300 rounded-sm mx-auto mb-8 p-8 flex flex-col w-7/8 md:w-3/5 lg:w-1/2">
      <h3 className="text-2xl italic text-center">Add a new task</h3>
      <form id="new_post_form"className="flex flex-col gap-5 m-6"
        onSubmit={(event) => {
          newPost(event);
        }}
      >
        <div id="title_status_box" className="flex flex-col lg:flex-row gap-2">
        <label className="flex basis-2/3 flex-col gap-2 ">
          Title
          <input className="p-2 bg-sky-100 rounded-sm border-1 placeholder:italic" name = "title" type="text" required placeholder="title" maxLength="100" />
        </label>
        <label className="flex basis-1/3 grow flex-col gap-2">
          Status
        <select className="p-2 bg-sky-100 rounded-sm border-1" name="status" required >
          <option value="to do">to do</option>
          <option value="in progress">in progress</option>
          <option value="completed">completed</option>
        </select>
        </label>
        </div>
        <label className="lg:w-1/2 flex flex-col gap-2">
          Due date
          <input className="p-2 bg-sky-100 rounded-sm border-1" name="due_date"type="datetime-local" required/>
        </label>
        <label className="items-center flex flex-col text-center gap-2">
          Description
          <textarea className="p-2 bg-sky-100 rounded-sm border-1 w-full min-h-60 lg:min-h-40 placeholder:italic" name = "description" required placeholder="description" maxLength="500"/>
        </label>
        <button className="self-center w-1/2 font-medium cursor-pointer hover:inset-shadow-sm hover:inset-shadow-gray-400 hover:bg-sky-100 px-5 py-3 rounded-lg active:bg-gray-500 active:text-sky-100 text-2xl " type="submit">Submit</button>
      </form>
      <h3></h3>
    </div>
  );
}

export default NewPost;
