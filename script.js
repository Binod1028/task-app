document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.querySelector('.add-btn');
  const taskSection = document.querySelector('.task-section');
  const editBtn = document.querySelector('#edit-task');
  const deleteBtn = document.querySelector('#delete-task');
  const searchInput = document.querySelector('.search-bar');

  addBtn.addEventListener('click', () => {
    const taskName = prompt("Enter your task:");
    if (taskName && taskName.trim() !== '') {
      const task = document.createElement('div');
      task.className = 'task-item';
      task.innerHTML = `
        <input type="radio" name="selected-task" class="task-select" />
        <span class="task-text">${taskName}</span>
      `;
      taskSection.appendChild(task);
    }
  });

  editBtn.addEventListener('click', () => {
    const selected = document.querySelector('.task-select:checked');
    if (selected) {
      const newTask = prompt("Edit your task:", selected.nextElementSibling.textContent);
      if (newTask && newTask.trim() !== '') {
        selected.nextElementSibling.textContent = newTask;
      }
    } else {
      alert("Please select a task to edit.");
    }
  });

  deleteBtn.addEventListener('click', () => {
    const selected = document.querySelector('.task-select:checked');
    if (selected) {
      selected.parentElement.remove();
    } else {
      alert("Please select a task to delete.");
    }
  });

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(task => {
      const taskText = task.textContent.toLowerCase();
      task.style.display = taskText.includes(query) ? 'flex' : 'none';
    });
  });
});
