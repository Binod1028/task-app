document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.querySelector('.add-btn');
  const taskSection = document.querySelector('.task-section');
  const editBtn = document.querySelector('#edit-task');
  const deleteBtn = document.querySelector('#delete-task');
  const searchInput = document.querySelector('.search-bar');

  // ---- Load tasks from backend on page load ----
  async function loadTasks() {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    if (data.success) {
      taskSection.querySelectorAll('.task-item').forEach(t => t.remove()); // Clear old
      data.tasks.forEach(task => renderTask(task));
    }
  }

  function renderTask(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task-item';
    taskEl.dataset.id = task.id;
    taskEl.innerHTML = `
      <input type="radio" name="selected-task" class="task-select" />
      <span class="task-text">${task.name}</span>
    `;
    taskSection.appendChild(taskEl);
  }

  // ---- Add new task (POST) ----
  addBtn.addEventListener('click', async () => {
    const taskName = prompt("Enter your task:");
    if (taskName && taskName.trim() !== '') {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskName })
      });
      const data = await res.json();
      if (data.success) renderTask(data.task);
      else alert(data.message);
    }
  });

  // ---- Edit task (PUT) ----
  editBtn.addEventListener('click', async () => {
    const selected = document.querySelector('.task-select:checked');
    if (!selected) return alert("Please select a task to edit.");

    const taskEl = selected.parentElement;
    const taskId = taskEl.dataset.id;
    const newTaskName = prompt("Edit your task:", taskEl.querySelector('.task-text').textContent);

    if (newTaskName && newTaskName.trim() !== '') {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTaskName })
      });
      const data = await res.json();
      if (data.success) taskEl.querySelector('.task-text').textContent = data.task.name;
      else alert(data.message);
    }
  });

  // ---- Search filter ----
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(task => {
      const taskText = task.textContent.toLowerCase();
      task.style.display = taskText.includes(query) ? 'flex' : 'none';
    });
  });

  // ---- Load tasks initially ----
  loadTasks();
});
