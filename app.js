
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');

const categorySelect = document.getElementById('category-select');



// Store tasks in an object with categories as keys
const tasks = {
  work: [],
  personal: [],
  shopping: [],
  study: [],
};

// Handle form submission
todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const taskTitle = todoInput.value.trim();
  const selectedCategory = categorySelect.value;
  const deadline = document.getElementById('deadline-input').value;
  const priority = document.getElementById('priority-select').value;

  if (taskTitle !== '' && selectedCategory in tasks) {
    addTask(selectedCategory, taskTitle, deadline, priority);
    todoInput.value = '';
    scrollToLastTask(selectedCategory);
  }
});

// Function to add a task
const tasksByDate = {};

function addTask(category, title, deadline, priority) {

  const task = {
    title: title,
    completed: false,
    deadline: deadline,
    priority: priority,
  };

  if (!tasksByDate[deadline]) {
    tasksByDate[deadline] = {};
  }
  if (!tasksByDate[deadline][category]) {
    tasksByDate[deadline][category] = [];
  }

  tasksByDate[deadline][category].push(task);
  renderTasks(category);
}

// Render tasks in the list
function renderTasks(category) {
  const container = document.querySelector(`.${category}-box`);
  // Clear only the tasks, not the entire container including the head
  const ul = container.querySelector('ul');
  ul.innerHTML = '';

  const sortedTasks = {};

  for (const deadline in tasksByDate) {
    const tasksForCategory = tasksByDate[deadline][category];
    if (tasksForCategory) {
      // Sort tasks by priority (high > medium > low)
      const sortedByPriority = tasksForCategory.sort((task1, task2) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[task2.priority] - priorityOrder[task1.priority];
      });

      sortedTasks[deadline] = sortedByPriority;
    }
  }

  // Sort tasks by deadline
  Object.keys(sortedTasks).sort().forEach(function (deadline) {
    const deadlineHeader = document.createElement('h3');
    
    if (!deadline) {
      deadlineHeader.textContent = "None"; // Handle "None" case
    } else {
      deadlineHeader.textContent = `Deadline: ${formatDeadline(deadline)}`;
    }
    
    ul.appendChild(deadlineHeader);

    sortedTasks[deadline].forEach(function (task, index) {
      const li = document.createElement('li');
      li.textContent = `${task.title} (Priority: ${task.priority})`;

      if (task.completed) {
        li.classList.add('completed');
      }

      li.addEventListener('click', function () {
        task.completed = !task.completed;
        renderTasks(category);
      });

      ul.appendChild(li);
    });
  });
}

// Set the default value for categorySelect
categorySelect.value = 'work'; // 'work' corresponds to the 'Work' category

// Add an event listener to the category select dropdown
categorySelect.addEventListener('change', function () {
  const selectedValue = categorySelect.value;
  if (selectedValue === 'new_category') {
    // Prompt the user for a new category name
    const newCategoryName = prompt('Enter a new category name:');
    if (newCategoryName !== null && newCategoryName.trim() !== '') {
      // Create a new option for the category and select it
      const newOption = document.createElement('option');
      newOption.value = newCategoryName;
      newOption.text = newCategoryName;
      categorySelect.appendChild(newOption);
      categorySelect.value = newCategoryName;
      addNewCategory(newCategoryName);
    } else {
      category.selectedValue="extra";
      category.selectedValue="okay";
      // Reset the dropdown to its previous value if the user cancels or enters an empty name
      categorySelect.value = 'work'; // Change to the default value or another suitable value
    }
  }
});

// Adding new category
function addNewCategory(categoryName) {
  // Create a container for new categories
  const newCategoriesContainer = document.querySelector('.new_categories');
  // Create a new category box
  const newCategoryBox = document.createElement('div');
  newCategoryBox.classList.add(`${categoryName}-box`);
  newCategoryBox.classList.add('box'); // Apply the 'box' class

  // Create the category head with title and clear button
  const categoryHead = document.createElement('div');
  categoryHead.classList.add('head');
  const categoryTitle = document.createElement('p');
  categoryTitle.classList.add('title');
  categoryTitle.textContent = `${categoryName} List`; // Use the entered category name
  const clearButton = document.createElement('button');
  clearButton.classList.add('clear');
  clearButton.type = 'submit';
  clearButton.setAttribute('data-category', categoryName);
  clearButton.textContent = 'Clear';

  categoryHead.appendChild(categoryTitle);
  categoryHead.appendChild(clearButton);

  // Create the list for this category
  const categoryList = document.createElement('ul');
  categoryList.id = `${categoryName}-list`; // Use the entered category name

  newCategoryBox.appendChild(categoryHead);
  newCategoryBox.appendChild(categoryList);

  // Append the new category to the new categories container
  newCategoriesContainer.appendChild(newCategoryBox);
}

// Event listener for all "Clear" buttons
document.querySelectorAll('.clear').forEach(function (clearButton) {
  clearButton.addEventListener('click', function () {
    const category = clearButton.getAttribute('data-category');
    clearCategory(category); // Clear the tasks, including the data
  });
});

// Function to clear a specific category, including deadlines
function clearCategory(category) {
  for (const deadline in tasksByDate) {
    if (tasksByDate[deadline][category]) {
      delete tasksByDate[deadline][category];
    }
  }
  renderTasks(category); // Re-render the tasks (which will be empty)
}

// Event listener for "Clear All" buttons
document.querySelectorAll('.clearAll').forEach(function (clearAllButton) {
  clearAllButton.addEventListener('click', function () {
    const category = clearAllButton.getAttribute('data-category');
    clearAllCategoryTasks(category); // Clear all tasks, but don't remove the head
  });
});

// Function to clear all tasks in all categories and their tasks objects, including deadlines
function clearAllCategoryTasks() {
  for (const category in tasks) {
    clearCategory(category); // Clear the tasks and associated deadlines for each category
  }
}

// Assuming 'deadline' is a string containing a date, e.g., "2023-10-31"
function formatDeadline(deadline) {
  const date = new Date(deadline);
  const options = { day: 'numeric', month: 'long',  year: 'numeric'};
  return date.toLocaleDateString('en-US', options);
}

function scrollToLastTask(category) {
  const container = document.querySelector(`.${category}-box`);
  const ul = container.querySelector('ul');
  const lastTask = ul.lastElementChild;
  if (lastTask) {
    lastTask.scrollIntoView({ behavior: 'smooth' });
  }
}
