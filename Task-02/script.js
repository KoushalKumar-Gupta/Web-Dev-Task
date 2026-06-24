/* ===========================================================
   TaskForge — script.js
   =========================================================== */

/* -----------------------------------------------------------
   1. MOBILE NAV TOGGLE
   ----------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu after clicking a link, and highlight active link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
    link.classList.add('active-link');
  });
});


/* -----------------------------------------------------------
   2. CONTACT FORM VALIDATION
   ----------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('nameError'),
    validate(value) {
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
    validate(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Email is required.';
      if (!emailRegex.test(value.trim())) return 'Enter a valid email address.';
      return '';
    }
  },
  phone: {
    input: document.getElementById('phone'),
    error: document.getElementById('phoneError'),
    validate(value) {
      if (!value.trim()) return ''; // optional field
      const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
      if (!phoneRegex.test(value.trim())) return 'Enter a valid phone number.';
      return '';
    }
  },
  subject: {
    input: document.getElementById('subject'),
    error: document.getElementById('subjectError'),
    validate(value) {
      if (!value) return 'Please select a subject.';
      return '';
    }
  },
  message: {
    input: document.getElementById('message'),
    error: document.getElementById('messageError'),
    validate(value) {
      if (!value.trim()) return 'Message is required.';
      if (value.trim().length < 10) return 'Message should be at least 10 characters.';
      return '';
    }
  },
  agree: {
    input: document.getElementById('agree'),
    error: document.getElementById('agreeError'),
    validate(_, input) {
      if (!input.checked) return 'You must agree before submitting.';
      return '';
    }
  }
};

function applyFieldResult(field, errorText) {
  const { input, error } = field;
  error.textContent = errorText;
  input.classList.remove('valid', 'invalid');
  input.classList.add(errorText ? 'invalid' : 'valid');
}

function validateField(key) {
  const field = fields[key];
  const value = field.input.type === 'checkbox' ? field.input.checked : field.input.value;
  const errorText = field.validate(value, field.input);
  applyFieldResult(field, errorText);
  return !errorText;
}

// Real-time validation as the user types / changes fields
Object.keys(fields).forEach(key => {
  const { input } = fields[key];
  const eventType = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
  input.addEventListener(eventType, () => validateField(key));
  input.addEventListener('blur', () => validateField(key));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('visible');

  let isFormValid = true;
  Object.keys(fields).forEach(key => {
    const valid = validateField(key);
    if (!valid) isFormValid = false;
  });

  if (isFormValid) {
    formSuccess.classList.add('visible');
    contactForm.reset();
    Object.values(fields).forEach(f => {
      f.input.classList.remove('valid', 'invalid');
      f.error.textContent = '';
    });
    setTimeout(() => formSuccess.classList.remove('visible'), 4000);
  } else {
    formSuccess.classList.remove('visible');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  setTimeout(() => {
    Object.values(fields).forEach(f => {
      f.input.classList.remove('valid', 'invalid');
      f.error.textContent = '';
    });
    formSuccess.classList.remove('visible');
  }, 0);
});


/* -----------------------------------------------------------
   3. DYNAMIC TO-DO LIST
   ----------------------------------------------------------- */
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoListEl = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';
let todoIdCounter = 0;

function renderTodos() {
  todoListEl.innerHTML = '';

  const visibleTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (visibleTodos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo-empty';
    empty.textContent = todos.length === 0
      ? 'No tasks yet — add one above!'
      : 'Nothing to show in this filter.';
    todoListEl.appendChild(empty);
  } else {
    visibleTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete';
      deleteBtn.innerHTML = '✕';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoListEl.appendChild(li);
    });
  }

  const activeCount = todos.filter(t => !t.completed).length;
  todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

function addTodo(text) {
  todos.push({ id: todoIdCounter++, text, completed: false });
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;
  addTodo(value);
  todoInput.value = '';
  todoInput.focus();
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  renderTodos();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

renderTodos();


/* -----------------------------------------------------------
   4. DYNAMIC IMAGE GALLERY
   ----------------------------------------------------------- */
const galleryForm = document.getElementById('galleryForm');
const imageUrlInput = document.getElementById('imageUrlInput');
const galleryGrid = document.getElementById('galleryGrid');

const defaultImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80'
];

let images = [...defaultImages];

function renderGallery() {
  galleryGrid.innerHTML = '';

  if (images.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.textContent = 'No images yet — paste a URL above to add one.';
    galleryGrid.appendChild(empty);
    return;
  }

  images.forEach((url, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = url;
    img.alt = `Gallery image ${index + 1}`;
    img.onerror = () => { item.remove(); images.splice(index, 1); };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'gallery-remove';
    removeBtn.innerHTML = '✕';
    removeBtn.setAttribute('aria-label', 'Remove image');
    removeBtn.addEventListener('click', () => {
      images = images.filter(u => u !== url);
      renderGallery();
    });

    item.appendChild(img);
    item.appendChild(removeBtn);
    galleryGrid.appendChild(item);
  });
}

galleryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = imageUrlInput.value.trim();
  if (!url) return;
  images.push(url);
  imageUrlInput.value = '';
  renderGallery();
});

renderGallery();
