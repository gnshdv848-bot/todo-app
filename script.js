// Select DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
let clearAllBtn = document.getElementById('clear-all-btn');

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

// Update empty state display
function updateEmptyState() {
  if (taskList.children.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
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
  deleteBtn.addEventListener('click', () => {
    li.remove();
    updateEmptyState();
  });

  // Assemble elements
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Clear input field and restore focus
  taskInput.value = '';
  taskInput.focus();

  // Refresh empty state
  updateEmptyState();
}

// Function to remove all tasks at once
function clearAllTasks() {
  taskList.innerHTML = '';
  updateEmptyState();
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

// Initial check for empty state
updateEmptyState();
