document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.querySelector('.add-btn');
  const taskSection = document.querySelector('.task-section');
  const editBtn = document.querySelector('#edit-task');
  const deleteBtn = document.querySelector('#delete-task');
  const completeBtn = document.querySelector('#complete-task');
  const searchInput = document.querySelector('.search-bar');
  const plusBtn = document.querySelector('.plus');
  const categoryContainer = document.querySelector('.categories');
  const sidebarCompleted = document.querySelector('.footer-buttons button:nth-child(1)');
  const sidebarTrash = document.querySelector('.footer-buttons button:nth-child(2)');
  const btnHome = document.querySelector('.btnHome');

  let currentCategoryId = null;
  let showCompleted = false;
  let showTrash = false;

  // Load categories
  async function loadCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) {
      categoryContainer.innerHTML = '';
      data.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = cat.categoryName;
        btn.dataset.id = cat._id;
        btn.addEventListener('click', () => {
          currentCategoryId = cat._id;
          showCompleted = false;
          showTrash = false;
          loadTasks();
        });
        categoryContainer.appendChild(btn);
      });
    }
  }

  // Load tasks
  async function loadTasks() {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    if (data.success) {
      taskSection.querySelectorAll('.task-item').forEach(t => t.remove());

      let tasks = data.tasks;

      // Filter tasks
      if (showTrash) tasks = tasks.filter(t => t.trashed);
      else if (showCompleted) tasks = tasks.filter(t => t.completed && !t.trashed);
      else if (currentCategoryId) tasks = tasks.filter(t => t.categoryId === currentCategoryId && !t.trashed);
      else tasks = tasks.filter(t => !t.trashed); // Home: only non-deleted tasks

      tasks.forEach(renderTask);
    }
  }

  function renderTask(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task-item';
    taskEl.dataset.id = task._id;
    taskEl.innerHTML = `
      <input type="checkbox" class="task-select" />
      <span class="task-text">${task.taskName}</span>
      ${task.completed ? '<span style="color:green;">✔ Completed</span>' : ''}
    `;
    taskSection.appendChild(taskEl);
  }

  // Add new task
  addBtn.addEventListener('click', async () => {
    const taskName = prompt("Enter task name:");
    if (!taskName || !taskName.trim()) return;

    let categoryId = currentCategoryId;
    if (!categoryId) {
      const resCat = await fetch('/api/categories');
      const dataCat = await resCat.json();
      if (dataCat.success && dataCat.categories.length > 0) {
        const names = dataCat.categories.map((c, i) => `${i + 1}. ${c.categoryName}`).join('\n');
        const choice = prompt(`Select category:\n${names}`);
        const index = parseInt(choice) - 1;
        if (!isNaN(index) && dataCat.categories[index]) categoryId = dataCat.categories[index]._id;
      }
    }

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName, categoryId })
    });
    const data = await res.json();
    if (data.success) loadTasks();
    else alert(data.message);
  });

  // Edit tasks
  editBtn.addEventListener('click', async () => {
    const selected = document.querySelectorAll('.task-select:checked');
    if (!selected.length) return alert("Select task(s) to edit.");

    for (let item of selected) {
      const taskEl = item.parentElement;
      const taskId = taskEl.dataset.id;
      const newName = prompt("Edit task:", taskEl.querySelector('.task-text').textContent);
      if (!newName || !newName.trim()) continue;

      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: newName, categoryId: currentCategoryId })
      });
    }
    loadTasks();
  });

  // Delete tasks
  deleteBtn.addEventListener('click', async () => {
    const selected = document.querySelectorAll('.task-select:checked');
    if (!selected.length) return alert("Select task(s) to delete.");

    if (!confirm("Are you sure you want to delete selected task(s)?")) return;

    for (let item of selected) {
      const taskId = item.parentElement.dataset.id;
      // Permanently delete if in Trash/Completed
      if (showTrash || showCompleted) {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      } else {
        // Soft delete for Home or category
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      }
    }
    loadTasks();
  });

  // Complete tasks
  completeBtn.addEventListener('click', async () => {
    const selected = document.querySelectorAll('.task-select:checked');
    if (!selected.length) return alert("Select task(s) to mark complete.");

    for (let item of selected) {
      const taskId = item.parentElement.dataset.id;
      await fetch(`/api/tasks/${taskId}/complete`, { method: 'PUT' });
    }
    loadTasks();
  });

  // Search tasks
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(task => {
      const taskText = task.querySelector('.task-text').textContent.toLowerCase();
      task.style.display = taskText.includes(query) ? 'flex' : 'none';
    });
  });

  // Add category
  plusBtn.addEventListener('click', async () => {
    const categoryName = prompt("Enter category name:");
    if (!categoryName || !categoryName.trim()) return;

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName })
    });
    const data = await res.json();
    if (data.success) loadCategories();
    else alert(data.message);
  });

  // Sidebar Completed
  sidebarCompleted.addEventListener('click', () => {
    showCompleted = true;
    showTrash = false;
    currentCategoryId = null;
    loadTasks();
  });

  // Sidebar Trash
  sidebarTrash.addEventListener('click', () => {
    showTrash = true;
    showCompleted = false;
    currentCategoryId = null;
    loadTasks();
  });

  // Home button
  btnHome.addEventListener('click', () => {
    showCompleted = false;
    showTrash = false;
    currentCategoryId = null;
    loadTasks();
  });

  // Initial load
  loadCategories();
  loadTasks();
});
