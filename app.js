const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');

const tasks = {
  work: [],
  personal: [],
  shopping: [],
  study: [],
};
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
function renderTasks(category) {
  const container = document.querySelector(`.${category}-box`);
  const ul = container.querySelector('ul');
  ul.innerHTML = '';
  const sortedTasks = {};
  for (const deadline in tasksByDate) {
    const tasksForCategory = tasksByDate[deadline][category];
    if (tasksForCategory) {
      const sortedByPriority = tasksForCategory.sort((task1, task2) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[task2.priority] - priorityOrder[task1.priority];
      });
      sortedTasks[deadline] = sortedByPriority;
    }
  }
  Object.keys(sortedTasks).sort().forEach(function (deadline) {
    const deadlineHeader = document.createElement('h3'); 
    if (!deadline) {
      deadlineHeader.textContent = "None";
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
categorySelect.value = 'work';
categorySelect.addEventListener('change', function () {
  const selectedValue = categorySelect.value;
  if (selectedValue === 'new_category') {
    const newCategoryName = prompt('Enter a new category name:');
    if (newCategoryName !== null && newCategoryName.trim() !== '') {
      const newOption = document.createElement('option');
      newOption.value = newCategoryName;
      newOption.text = newCategoryName;
      categorySelect.appendChild(newOption);
      categorySelect.value = newCategoryName;
      addNewCategory(newCategoryName);
    } else {
      category.selectedValue="extra";
      category.selectedValue="okay";
      categorySelect.value = 'work';
    }
  }
});
function addNewCategory(categoryName) {
  const newCategoriesContainer = document.querySelector('.new_categories');
  const newCategoryBox = document.createElement('div');
  newCategoryBox.classList.add(`${categoryName}-box`);
  newCategoryBox.classList.add('box'); 
  const categoryHead = document.createElement('div');
  categoryHead.classList.add('head');
  const categoryTitle = document.createElement('p');
  categoryTitle.classList.add('title');
  categoryTitle.textContent = `${categoryName} List`; 
  const clearButton = document.createElement('button');
  clearButton.classList.add('clear');
  clearButton.type = 'submit';
  clearButton.setAttribute('data-category', categoryName);
  clearButton.textContent = 'Clear';
  categoryHead.appendChild(categoryTitle);
  categoryHead.appendChild(clearButton);
  const categoryList = document.createElement('ul');
  categoryList.id = `${categoryName}-list`;
  newCategoryBox.appendChild(categoryHead);
  newCategoryBox.appendChild(categoryList);
  newCategoriesContainer.appendChild(newCategoryBox);
}
document.querySelectorAll('.clear').forEach(function (clearButton) {
  clearButton.addEventListener('click', function () {
    const category = clearButton.getAttribute('data-category');
    clearCategory(category);
  });
});
function clearCategory(category) {
  for (const deadline in tasksByDate) {
    if (tasksByDate[deadline][category]) {
      delete tasksByDate[deadline][category];
    }
  }
  renderTasks(category);
}
document.querySelectorAll('.clearAll').forEach(function (clearAllButton) {
  clearAllButton.addEventListener('click', function () {
    const category = clearAllButton.getAttribute('data-category');
    clearAllCategoryTasks(category);
  });
});
function clearAllCategoryTasks() {
  for (const category in tasks) {
    clearCategory(category);
  }
}
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