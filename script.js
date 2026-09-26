// Select DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
let clearAllBtn = document.getElementById('clear-all-btn');
let taskCounter = document.getElementById('task-counter') || document.getElementById('tasks-remaining');
let remainingCount = document.getElementById('remaining-count');

// Create clear-all button dynamically if not present in DOM
if (!clearAllBtn) {
  clearAllBtn = document.createElement('button');
  clearAllBtn.id = 'clear-all-btn';
  clearAllBtn.className = 'clear-all-btn';
  clearAllBtn.type = 'button';
  clearAllBtn.textContent = 'Clear All';
  const container = document.querySelector('.todo-container') || document.body;
  container.appendChild(clearAllBtn);
}

// Create task counter dynamically if not present in DOM
if (!taskCounter) {
  taskCounter = document.createElement('p');
  taskCounter.id = 'task-counter';
  taskCounter.className = 'task-counter';
  taskCounter.innerHTML = '<span id="tasks-remaining">Tasks remaining: <span id="remaining-count">0</span></span>';
  const header = document.querySelector('.app-header');
  if (header) {
    header.appendChild(taskCounter);
  } else {
    const container = document.querySelector('.todo-container') || document.body;
    container.prepend(taskCounter);
  }
  remainingCount = document.getElementById('remaining-count');
}

// Update empty state display
function updateEmptyState() {
  if (taskList.children.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

// Update remaining tasks counter
function updateTaskCounter() {
  const remaining = taskList.querySelectorAll('.task-item:not(.completed)').length;
  const countSpan = document.getElementById('remaining-count');
  if (countSpan) {
    countSpan.textContent = remaining;
  }
  const counterEl = document.getElementById('task-counter') || document.getElementById('tasks-remaining');
  if (counterEl && !countSpan) {
    counterEl.textContent = `Tasks remaining: ${remaining}`;
  }
}

// Function to create and add a new task item
function addTask() {
  const taskText = taskInput.value.trim();

  // Validate that input is not empty
  if (taskText === '') {
    taskInput.focus();
    return;
  }

  // Create task list item (li)
  const li = document.createElement('li');
  li.className = 'task-item';

  // Create span for task description
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = taskText;

  // Create delete button with a small red 'X'
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'X';
  deleteBtn.setAttribute('aria-label', `Delete task: ${taskText}`);

  // Event listener to remove task when delete button is clicked
  deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    li.remove();
    updateEmptyState();
    updateTaskCounter();
  });

  // Event listener to toggle completed status when task is clicked
  li.addEventListener('click', (event) => {
    if (event.target.closest('.delete-btn')) {
      return;
    }
    li.classList.toggle('completed');
    updateTaskCounter();
  });

  // Assemble elements
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Clear input field and restore focus
  taskInput.value = '';
  taskInput.focus();

  // Refresh empty state and task counter
  updateEmptyState();
  updateTaskCounter();
}

// Function to remove all tasks at once
function clearAllTasks() {
  taskList.innerHTML = '';
  updateEmptyState();
  updateTaskCounter();
}

// Event listener for the "Add" button click
addBtn.addEventListener('click', addTask);

// Event listener for the "Clear All" button click
clearAllBtn.addEventListener('click', clearAllTasks);

// Event listener to allow pressing "Enter" key in the input box
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Initial check for empty state and task counter
updateEmptyState();
updateTaskCounter();
