document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(taskForm);
    const taskData = {};
    formData.forEach((value, key) => {
      taskData[key] = value;
    });

    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then(response => response.text())
      .then(() => {
        taskForm.reset();
        fetchTasks();
      });
  });

  function fetchTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.textContent = `${task.title} - ${task.description} - ${task.status} - ${task.due_date}`;

          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => editTask(task.id));

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => deleteTask(task.id));

          li.appendChild(editButton);
          li.appendChild(deleteButton);

          taskList.appendChild(li);
        });
      });
  }

  function editTask(taskId) {
    // Implement edit task functionality here
    console.log(`Editing task with id ${taskId}`);
  }

  function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => response.text())
      .then(() => {
        fetchTasks();
      });
  }

  fetchTasks();
});
