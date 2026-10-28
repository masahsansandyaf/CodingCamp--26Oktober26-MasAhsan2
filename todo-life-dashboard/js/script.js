/**
 * script.js
 * To-Do Life Dashboard — Core JavaScript
 *
 * Sections:
 *   1. Clock & Greeting
 *   2. Focus Timer
 *   3. To-Do List
 *   4. Quick Links
 *   5. Custom Greeting Name
 *   6. Light / Dark Theme
 *   7. Init
 */

'use strict';

/* =============================================================
   1. CLOCK & GREETING
   ============================================================= */

/** Day and month name arrays for manual date formatting. */
var DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

var MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Zero-pad a number to two digits.
 * @param {number} n
 * @returns {string}
 */
function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

/**
 * Pure function — returns the correct greeting for the given hour (0–23).
 * @param {number} hour  Integer in [0, 23].
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 21) return 'Good Evening';
  return 'Good Night'; // 22–23 and 0–4
}

/**
 * Updates #greeting with a time-based salutation + optional saved name.
 */
function updateGreeting() {
  var hour = new Date().getHours();
  var salutation = getGreeting(hour);
  var name = localStorage.getItem('tdl_name') || '';

  var greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;

  if (name) {
    greetingEl.textContent = salutation + ', ' + name + '!';
  } else {
    greetingEl.textContent = salutation + '!';
  }
}

/**
 * Updates #time (HH:MM:SS) and #date (Day, DD Month YYYY) every second.
 * Also refreshes the greeting in case the hour changes mid-session.
 */
function updateClock() {
  var now = new Date();

  // --- Time ---
  var timeStr = pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
  var timeEl = document.getElementById('time');
  if (timeEl) timeEl.textContent = timeStr;

  // --- Date ---
  var dayName = DAY_NAMES[now.getDay()];
  var dateNum = now.getDate();
  var monthName = MONTH_NAMES[now.getMonth()];
  var year = now.getFullYear();
  var dateStr = dayName + ', ' + dateNum + ' ' + monthName + ' ' + year;
  var dateEl = document.getElementById('date');
  if (dateEl) dateEl.textContent = dateStr;

  // --- Greeting (refresh every tick) ---
  updateGreeting();
}

/* =============================================================
   2. FOCUS TIMER
   ============================================================= */

/** Interval ID returned by setInterval; null means the timer is not running. */
var timerId = null;

/** Remaining time in seconds. Starts at 25 minutes. */
var timeLeft = 25 * 60;

/** Whether the timer is currently counting down. */
var timerRunning = false;

/**
 * Formats timeLeft as MM:SS and writes it to #timer-display.
 */
function renderTimer() {
  var mins = Math.floor(timeLeft / 60);
  var secs = timeLeft % 60;
  var display = pad2(mins) + ':' + pad2(secs);
  var el = document.getElementById('timer-display');
  if (el) el.textContent = display;
}

/**
 * Called every second while the timer is running.
 * Decrements timeLeft and handles reaching zero.
 */
function tick() {
  timeLeft -= 1;
  renderTimer();

  if (timeLeft <= 0) {
    // Timer complete
    clearInterval(timerId);
    timerId = null;
    timerRunning = false;

    // Show completion indicator
    var completeEl = document.getElementById('timer-complete');
    if (completeEl) completeEl.classList.remove('hidden');

    // Disable Start button
    var startBtn = document.getElementById('start-timer');
    if (startBtn) startBtn.disabled = true;
  }
}

/**
 * Starts (or resumes) the countdown.
 * Guards against starting multiple intervals or restarting a completed timer.
 */
function startTimer() {
  if (timerRunning) return;  // already running
  if (timeLeft <= 0) return; // already complete

  timerRunning = true;

  // Safety: clear any stale interval before setting a new one
  if (timerId !== null) {
    clearInterval(timerId);
  }
  timerId = setInterval(tick, 1000);

  // Button state
  var startBtn = document.getElementById('start-timer');
  if (startBtn) startBtn.disabled = true;

  var pauseBtn = document.getElementById('pause-timer');
  if (pauseBtn) pauseBtn.disabled = false;
}

/**
 * Pauses the running countdown without resetting the time.
 */
function pauseTimer() {
  if (!timerRunning) return;

  clearInterval(timerId);
  timerId = null;
  timerRunning = false;

  // Button state
  var startBtn = document.getElementById('start-timer');
  if (startBtn) startBtn.disabled = false;

  var pauseBtn = document.getElementById('pause-timer');
  if (pauseBtn) pauseBtn.disabled = true;
}

/**
 * Stops the timer and resets it back to 25:00.
 */
function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  timerRunning = false;
  timeLeft = 25 * 60;

  renderTimer();

  // Hide completion indicator
  var completeEl = document.getElementById('timer-complete');
  if (completeEl) completeEl.classList.add('hidden');

  // Re-enable Start, disable Pause
  var startBtn = document.getElementById('start-timer');
  if (startBtn) startBtn.disabled = false;

  var pauseBtn = document.getElementById('pause-timer');
  if (pauseBtn) pauseBtn.disabled = true;
}

/* =============================================================
   3. TO-DO LIST
   ============================================================= */

var TASKS_KEY = 'tdl_tasks';

/**
 * Reads tasks array from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 * @returns {{ id: string, text: string, completed: boolean }[]}
 */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Writes the tasks array to localStorage.
 * @param {{ id: string, text: string, completed: boolean }[]} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/**
 * Pure function — checks whether trimmed+lowercased text already exists.
 * @param {string} text
 * @param {{ id: string, text: string, completed: boolean }[]} tasks
 * @returns {boolean}
 */
function isDuplicate(text, tasks) {
  var normalised = text.trim().toLowerCase();
  return tasks.some(function (t) {
    return t.text.trim().toLowerCase() === normalised;
  });
}

/**
 * Shows the task error message.
 * @param {string} message
 */
function showTaskError(message) {
  var errorEl = document.getElementById('task-error');
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

/**
 * Hides the task error message.
 */
function clearTaskError() {
  var errorEl = document.getElementById('task-error');
  if (!errorEl) return;
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

/**
 * Renders the full task list into #task-list.
 * Clears the list first, then rebuilds from the tasks array.
 * @param {{ id: string, text: string, completed: boolean }[]} tasks
 */
function renderTasks(tasks) {
  var list = document.getElementById('task-list');
  if (!list) return;

  // Clear existing items
  list.innerHTML = '';

  // Empty state
  if (tasks.length === 0) {
    var emptyLi = document.createElement('li');
    emptyLi.className = 'text-sm text-gray-400 dark:text-gray-500 py-2 text-center';
    emptyLi.textContent = 'No tasks yet. Add one above!';
    list.appendChild(emptyLi);
    return;
  }

  tasks.forEach(function (task) {
    // <li>
    var li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.className = 'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' +
      (task.completed ? ' task-completed' : '');

    // Checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark complete');
    checkbox.className = 'w-4 h-4 accent-indigo-600 cursor-pointer flex-shrink-0';
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    // Task text span
    var textSpan = document.createElement('span');
    textSpan.className = 'task-text flex-1 text-sm text-gray-700 dark:text-gray-300';
    textSpan.textContent = task.text; // textContent keeps it safe from XSS

    // Edit button
    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.className = 'text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors';
    editBtn.addEventListener('click', function () {
      editTask(task.id);
    });

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.className = 'text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors';
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

/**
 * Reads the task input, validates, and adds a new task.
 */
function addTask() {
  var input = document.getElementById('task-input');
  if (!input) return;

  var raw = input.value;
  var trimmed = raw.trim();

  // Reject empty / whitespace-only
  if (!trimmed) {
    showTaskError('Please enter a task.');
    return;
  }

  var tasks = loadTasks();

  // Reject duplicates (case- and trim-insensitive)
  if (isDuplicate(trimmed, tasks)) {
    showTaskError('Task already exists.');
    return;
  }

  // Valid — clear error and add task
  clearTaskError();

  tasks.push({
    id: Date.now().toString(),
    text: trimmed,
    completed: false
  });

  saveTasks(tasks);
  renderTasks(tasks);
  input.value = '';
  input.focus();
}

/**
 * Flips the completed state of a task by id.
 * @param {string} id
 */
function toggleTask(id) {
  var tasks = loadTasks();
  tasks = tasks.map(function (t) {
    if (t.id === id) {
      return { id: t.id, text: t.text, completed: !t.completed };
    }
    return t;
  });
  saveTasks(tasks);
  renderTasks(tasks);
}

/**
 * Switches the task's text label to an inline edit input.
 * Saves on confirm (Enter or Save button), cancels on Escape.
 * @param {string} id
 */
function editTask(id) {
  var tasks = loadTasks();
  var task = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) { task = tasks[i]; break; }
  }
  if (!task) return;

  // Find the rendered <li> for this task
  var list = document.getElementById('task-list');
  if (!list) return;
  var li = list.querySelector('li[data-id="' + id + '"]');
  if (!li) return;

  // Find the text span and replace it with an input
  var textSpan = li.querySelector('.task-text');
  if (!textSpan) return;

  var editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = task.text;
  editInput.className = 'task-text flex-1 text-sm px-2 py-0.5 rounded border border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400';
  editInput.maxLength = 200;

  // Save button
  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.className = 'text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors';

  // Replace span with input
  li.replaceChild(editInput, textSpan);

  // Insert Save button before Edit button (edit button is still in the DOM)
  var editBtn = li.querySelector('button[aria-label="Edit task"]');
  if (editBtn) {
    li.insertBefore(saveBtn, editBtn);
    editBtn.classList.add('hidden'); // hide the original Edit button while editing
  } else {
    li.appendChild(saveBtn);
  }

  editInput.focus();
  editInput.select();

  /** Commits the edit if the new value is valid. */
  function commitEdit() {
    var newText = editInput.value.trim();
    if (!newText) {
      // Empty — restore original and bail
      renderTasks(loadTasks());
      return;
    }
    var updatedTasks = loadTasks();
    updatedTasks = updatedTasks.map(function (t) {
      if (t.id === id) {
        return { id: t.id, text: newText, completed: t.completed };
      }
      return t;
    });
    saveTasks(updatedTasks);
    renderTasks(updatedTasks);
  }

  saveBtn.addEventListener('click', commitEdit);

  editInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      // Cancel — restore without saving
      renderTasks(loadTasks());
    }
  });
}

/**
 * Removes a task from the list by id.
 * @param {string} id
 */
function deleteTask(id) {
  var tasks = loadTasks().filter(function (t) {
    return t.id !== id;
  });
  saveTasks(tasks);
  renderTasks(tasks);
}

/* =============================================================
   4. QUICK LINKS
   ============================================================= */

var LINKS_KEY = 'tdl_links';

/**
 * Reads links array from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 * @returns {{ id: string, label: string, url: string }[]}
 */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(LINKS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Writes the links array to localStorage.
 * @param {{ id: string, label: string, url: string }[]} links
 */
function saveLinks(links) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

/**
 * Shows the link error message.
 * @param {string} message
 */
function showLinkError(message) {
  var errorEl = document.getElementById('link-error');
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

/**
 * Hides the link error message.
 */
function clearLinkError() {
  var errorEl = document.getElementById('link-error');
  if (!errorEl) return;
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

/**
 * Renders the full links list into #link-list.
 * Clears the list first, then rebuilds from the links array.
 * @param {{ id: string, label: string, url: string }[]} links
 */
function renderLinks(links) {
  var list = document.getElementById('link-list');
  if (!list) return;

  // Clear existing items
  list.innerHTML = '';

  // Empty state
  if (links.length === 0) {
    var emptyLi = document.createElement('li');
    emptyLi.className = 'text-sm text-gray-400 dark:text-gray-500 py-2 text-center w-full';
    emptyLi.textContent = 'No links yet. Add one above!';
    list.appendChild(emptyLi);
    return;
  }

  links.forEach(function (link) {
    var li = document.createElement('li');
    li.setAttribute('data-id', link.id);
    li.className = 'flex items-center gap-2';

    // Anchor chip
    var a = document.createElement('a');
    a.setAttribute('href', link.url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = link.label; // textContent keeps it safe from XSS
    a.className = 'link-chip text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm';

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete link');
    deleteBtn.className = 'text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
    });

    li.appendChild(a);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

/**
 * Reads the link label and URL inputs, validates, and adds a new link.
 */
function addLink() {
  var labelInput = document.getElementById('link-label');
  var urlInput = document.getElementById('link-url');
  if (!labelInput || !urlInput) return;

  var trimmedLabel = labelInput.value.trim();
  var trimmedUrl = urlInput.value.trim();

  // Reject empty label
  if (!trimmedLabel) {
    showLinkError('Please enter a label.');
    return;
  }

  // Reject empty URL
  if (!trimmedUrl) {
    showLinkError('Please enter a URL.');
    return;
  }

  // Valid — clear error and add link
  clearLinkError();

  var links = loadLinks();
  links.push({
    id: Date.now().toString(),
    label: trimmedLabel,
    url: trimmedUrl
  });

  saveLinks(links);
  renderLinks(links);

  labelInput.value = '';
  urlInput.value = '';
  labelInput.focus();
}

/**
 * Removes a link from the list by id.
 * @param {string} id
 */
function deleteLink(id) {
  var links = loadLinks().filter(function (l) {
    return l.id !== id;
  });
  saveLinks(links);
  renderLinks(links);
}

/* =============================================================
   5. CUSTOM GREETING NAME
   ============================================================= */

var NAME_KEY = 'tdl_name';

/**
 * Reads the name input, saves or removes the name in localStorage,
 * then refreshes the greeting display immediately.
 */
function saveName() {
  var input = document.getElementById('name-input');
  if (!input) return;

  var trimmedName = input.value.trim();

  if (trimmedName) {
    localStorage.setItem(NAME_KEY, trimmedName);
  } else {
    localStorage.removeItem(NAME_KEY);
  }

  updateGreeting();
}

/**
 * Reads the saved name from localStorage and pre-fills the name input.
 * Also refreshes the greeting so it reflects the stored name on load.
 */
function loadName() {
  var savedName = localStorage.getItem(NAME_KEY) || '';
  var input = document.getElementById('name-input');
  if (input) {
    input.value = savedName;
  }
  updateGreeting();
}

/* =============================================================
   6. LIGHT / DARK THEME
   ============================================================= */

/**
 * Applies the given theme by toggling the `dark` / `light` class on <html>.
 * @param {string} theme  Either "dark" or "light".
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
}

/**
 * Toggles between light and dark themes and persists the new value.
 */
function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    applyTheme('light');
    localStorage.setItem('tdl_theme', 'light');
  } else {
    applyTheme('dark');
    localStorage.setItem('tdl_theme', 'dark');
  }
}

/* =============================================================
   7. INIT
   ============================================================= */

/**
 * Entry point — wires all events and loads initial state.
 * Called on DOMContentLoaded.
 */
function init() {
  // --- Tasks ---
  var tasks = loadTasks();
  renderTasks(tasks);

  var addTaskBtn = document.getElementById('add-task-btn');
  if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);

  var taskInput = document.getElementById('task-input');
  if (taskInput) {
    taskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addTask(); }
    });
  }

  // --- Timer ---
  renderTimer();

  var startBtn = document.getElementById('start-timer');
  if (startBtn) startBtn.addEventListener('click', startTimer);

  var pauseBtn = document.getElementById('pause-timer');
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);

  var resetBtn = document.getElementById('reset-timer');
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  // --- Clock ---
  updateClock();
  setInterval(updateClock, 1000);

  // --- Quick Links (Task 3) ---
  renderLinks(loadLinks());

  var addLinkBtn = document.getElementById('add-link-btn');
  if (addLinkBtn) addLinkBtn.addEventListener('click', addLink);

  var linkUrlInput = document.getElementById('link-url');
  if (linkUrlInput) {
    linkUrlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addLink(); }
    });
  }

  // --- Custom Name (Task 3) ---
  loadName();

  var saveNameBtn = document.getElementById('save-name');
  if (saveNameBtn) saveNameBtn.addEventListener('click', saveName);

  var nameInput = document.getElementById('name-input');
  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); saveName(); }
    });
  }

  // --- Theme Toggle (Task 3) ---
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
}

// Kick everything off once the DOM is ready
document.addEventListener('DOMContentLoaded', init);
