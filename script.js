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

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  const items = taskList.querySelectorAll('.task-item');
  items.forEach((li) => {
    const textSpan = li.querySelector('.task-text');
    if (textSpan) {
      tasks.push({
        text: textSpan.textContent,
        completed: li.classList.contains('completed')
      });
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper function to create and attach a task DOM element
function createTaskElement(taskText, isCompleted = false) {
  // Create task list item (li)
  const li = document.createElement('li');
  li.className = 'task-item';
  if (isCompleted) {
    li.classList.add('completed');
  }

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
    saveTasks();
  });

  // Event listener to toggle completed status when task is clicked
  li.addEventListener('click', (event) => {
    if (event.target.closest('.delete-btn')) {
      return;
    }
    li.classList.toggle('completed');
    updateTaskCounter();
    saveTasks();
  });

  // Assemble elements
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  return li;
}

// Function to handle adding a new task from input
function addTask() {
  const taskText = taskInput.value.trim();

  // Validate that input is not empty
  if (taskText === '') {
    taskInput.focus();
    return;
  }

  // Create and append task item
  createTaskElement(taskText, false);

  // Clear input field and restore focus
  taskInput.value = '';
  taskInput.focus();

  // Refresh empty state, task counter, and save to localStorage
  updateEmptyState();
  updateTaskCounter();
  saveTasks();
}

// Function to remove all tasks at once
function clearAllTasks() {
  taskList.innerHTML = '';
  updateEmptyState();
  updateTaskCounter();
  saveTasks();
}

// Function to retrieve saved tasks from localStorage on startup
function loadTasks() {
  try {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const tasks = JSON.parse(saved);
      if (Array.isArray(tasks)) {
        tasks.forEach((task) => {
          if (task && typeof task.text === 'string') {
            createTaskElement(task.text, Boolean(task.completed));
          }
        });
      }
    }
  } catch (error) {
    console.error('Could not load tasks from localStorage:', error);
  }

  // Refresh UI state
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

// Load saved tasks from localStorage when the page loads
loadTasks();
