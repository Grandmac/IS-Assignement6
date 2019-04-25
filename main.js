import { openDb, fetchTodos, createTodo, deleteTodo, editTodo } from './db.js'

// Get references to the form elements.
const newTodoForm = document.getElementById('new-todo-form')
const newTodoInput = document.getElementById('new-todo')
const todoList = document.getElementById('todo-items')

// Handle new todo item form submissions.
newTodoForm.onsubmit = function() {
  // Get the todo text.
  const text = newTodoInput.value

  // Check to make sure the text is not blank (or just spaces).
  if (text.replace(/ /g, '') !== '') {
    // Create the todo item.
    createTodo(text, function(todo) {
      refreshTodos()
    })
  }

  // Reset the input field.
  newTodoInput.value = ''

  // Don't send the form.
  return false
}

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    todoList.innerHTML = ''

    if (todos.length === 0) {
      todoList.innerHTML = '' +
          '<div style="text-align: center;">' +
            '<i class="fas fa-box-open"></i>' +
            '<p>No items</p>' +
          '</div>';
      return;
    }

    for (let index = todos.length - 1; index >= 0; index--) {
      // Read the todo items backwards (most recent first).
      const todo = todos[index]

      addTodo(todo)
    }
  })
}

function addTodo(todo) {
  const li = document.createElement('li');
  li.id = 'todo-' + todo.timestamp;

  const todoText = document.createElement('input');
  todoText.type = 'text';
  todoText.value = todo.text;
  todoText.disabled = true;
  todoText.className = 'todo-text';
  todoText.setAttribute('data-id', todo.timestamp);

  li.appendChild(todoText);

  createToolbox(todo.timestamp, li);

  createEditbox(todo.timestamp, li)

  todoList.appendChild(li);
}

function createToolbox(timestamp, li) {
  const toolBox = document.createElement('div');

  toolBox.setAttribute('toolbox-id', timestamp);

  // Create delete button
  const deleteBtn = document.createElement('i');

  deleteBtn.classList.add('far');
  deleteBtn.classList.add('fa-trash-alt');

  deleteBtn.setAttribute('data-id', timestamp);

  // Setup an event listener for the toolbox.
  deleteBtn.addEventListener('click', function (e) {
    const id = parseInt(e.target.getAttribute('data-id'));

    deleteTodo(id, refreshTodos)
  });

  // Create Edit button
  const editBtn = document.createElement('i');

  editBtn.classList.add('far');
  editBtn.classList.add('fa-edit');

  editBtn.setAttribute('data-id', timestamp);

  // Setup an event listener for the edit button.
  editBtn.addEventListener('click', function (e) {
    const id = parseInt(e.target.getAttribute('data-id'));

    const input = FindByAttributeValue('data-id', id);

    input.setAttribute('initial-text', input.value);
    input.disabled = false;

    FindByAttributeValue('toolbox-id', id).style.display = 'none';
    FindByAttributeValue('editbox-id', id).style.display = 'block';
  })


  // append elements in html
  toolBox.appendChild(editBtn);

  toolBox.appendChild(deleteBtn);

  li.appendChild(toolBox);
}

function createEditbox(timestamp, li) {
  const editBox = document.createElement('div');

  editBox.className = 'todo-editbox';
  editBox.setAttribute('editbox-id', timestamp);

  // Create delete button
  const cancelBtn = document.createElement('i');

  cancelBtn.classList.add('fas');
  cancelBtn.classList.add('fa-times');

  cancelBtn.setAttribute('cancel-id', timestamp);

  cancelBtn.addEventListener('click', function (e) {
    const id = parseInt(e.target.getAttribute('cancel-id'));

    const input = FindByAttributeValue('data-id', id);

    input.value = input.getAttribute('initial-text');

    input.disabled = true;

    FindByAttributeValue('toolbox-id', id).style.display = 'block';
    FindByAttributeValue('editbox-id', id).style.display = 'none';
  });

  // Create Edit button
  const checkBtn = document.createElement('i');

  checkBtn.classList.add('fas');
  checkBtn.classList.add('fa-check');

  checkBtn.setAttribute('success-id', timestamp);

  // Setup an event listener for the check button.
  checkBtn.addEventListener('click', function (e) {
    const id = parseInt(e.target.getAttribute('success-id'));

    const input = FindByAttributeValue('data-id', id);

    input.disabled = true;

    FindByAttributeValue('toolbox-id', id).style.display = 'block';
    FindByAttributeValue('editbox-id', id).style.display = 'none';

    editTodo(input.value, id, refreshTodos);
  })

  editBox.style.display = 'none';

  // append elements in html
  editBox.appendChild(cancelBtn);

  editBox.appendChild(checkBtn);

  li.appendChild(editBox);
}

function FindByAttributeValue(attribute, value, element_type)    {
  element_type = element_type || "*";
  var All = document.getElementsByTagName(element_type);
  for (var i = 0; i < All.length; i++)       {
    if (All[i].getAttribute(attribute) == value) { return All[i]; }
  }
}