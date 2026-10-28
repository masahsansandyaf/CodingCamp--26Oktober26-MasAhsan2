# Design Document

## Overview

The To-Do Life Dashboard is a static, single-page web application built with HTML, CSS, and vanilla JavaScript. It runs entirely in the browser with no build step, no npm packages, and no backend. All persistent data is stored in `localStorage`. The app is structured as three files: `index.html`, `css/style.css`, and `js/script.js`.

## Architecture

The application has no framework or module system. Everything lives in one HTML page and one JS file. The architecture is a simple event-driven model:

1. On `DOMContentLoaded`, `init()` runs and sets up the initial state.
2. User interactions fire event listeners that call focused functions.
3. Each function that changes data saves immediately to `localStorage`.
4. The DOM is updated directly (no virtual DOM, no reactivity).

```
index.html
  └── loads css/style.css
  └── loads Tailwind CSS via CDN
  └── loads js/script.js (deferred)

js/script.js
  ├── Theme module    (applyTheme, toggleTheme)
  ├── Clock module    (updateClock, getGreeting)
  ├── Name module     (saveName, loadName)
  ├── Timer module    (startTimer, pauseTimer, resetTimer, tick)
  ├── Tasks module    (loadTasks, saveTasks, addTask, toggleTask, editTask, deleteTask, isDuplicate)
  ├── Links module    (loadLinks, saveLinks, addLink, deleteLink)
  └── init()
```

## Components and Interfaces

### Page Layout

The page is divided into three visual sections:

**Header**
- Time-based greeting + optional custom name (e.g., "Good Morning, Alex!")
- Current date (Day, DD Month YYYY)
- Current time (HH:MM:SS) — updates every second via `setInterval`
- Name input field with Save and Clear buttons
- Light/Dark theme toggle button

**Main Area** — two columns on desktop, single column on mobile (Tailwind grid)
- Left/top: To-Do List card
  - Text input + Add button
  - Inline error message for empty or duplicate task
  - Task list items — each has: checkbox, text label, Edit button, Delete button
- Right/bottom: Focus Timer card
  - MM:SS countdown display
  - Start, Pause, Reset buttons
  - Completion indicator shown when timer reaches 00:00

**Quick Links Section**
- Label input + URL input + Add button
- Inline error for empty label or empty URL
- Rendered links: clickable label (opens in new tab) + Delete button

### JavaScript Functions

| Section | Functions |
|---------|-----------|
| Theme | `applyTheme(theme)`, `toggleTheme()` |
| Clock | `updateClock()`, `getGreeting(hour)` |
| Name | `saveName()`, `loadName()` |
| Timer | `startTimer()`, `pauseTimer()`, `resetTimer()`, `tick()` |
| Tasks | `loadTasks()`, `saveTasks()`, `addTask()`, `toggleTask(id)`, `editTask(id)`, `deleteTask(id)`, `isDuplicate(text)` |
| Links | `loadLinks()`, `saveLinks()`, `addLink()`, `deleteLink(id)` |
| Init | `init()` |

**Key behaviors:**
- `getGreeting(hour)` — pure function, returns salutation based on hour (0–23).
- `isDuplicate(text)` — pure function, compares trimmed+lowercased text against existing tasks.
- `startTimer()` — checks `timerId` is null before calling `setInterval` to prevent multiple intervals.
- `tick()` — decrements remaining seconds; clears interval and shows completion indicator at 0.
- `init()` — called on `DOMContentLoaded`; loads theme, name, tasks, and links; starts the clock interval.

## Data Models

All data lives in `localStorage` under these keys:

| Key | Type | Shape |
|-----|------|-------|
| `tdl_tasks` | JSON array | `[{ id: string, text: string, completed: boolean }]` |
| `tdl_links` | JSON array | `[{ id: string, label: string, url: string }]` |
| `tdl_name` | string | Plain string, e.g. `"Alex"` |
| `tdl_theme` | string | `"light"` or `"dark"` |

IDs are generated with `Date.now().toString()` or a simple counter — unique within a session is sufficient.

Read pattern for all keys:
```js
JSON.parse(localStorage.getItem('tdl_tasks') || '[]')
```

Write pattern:
```js
localStorage.setItem('tdl_tasks', JSON.stringify(tasks))
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Greeting correctness for all hours

*For any* integer hour in [0, 23], `getGreeting(hour)` SHALL return exactly one of "Good Morning", "Good Afternoon", "Good Evening", or "Good Night", consistent with the ranges defined in Requirements 1.3–1.6.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

---

### Property 2: Valid task text is added to the list

*For any* non-empty, non-whitespace-only string that is not a duplicate, calling `addTask(text)` SHALL increase the task array length by exactly one, and the new task's text SHALL equal the trimmed input.

**Validates: Requirements 3.1**

---

### Property 3: Whitespace-only text is rejected

*For any* string composed entirely of whitespace characters, calling `addTask(text)` SHALL leave the task array unchanged.

**Validates: Requirements 3.2**

---

### Property 4: Task completion toggle flips state

*For any* task with a known `completed` value, calling `toggleTask(id)` SHALL produce a task whose `completed` field is the logical inverse of the original value.

**Validates: Requirements 3.3**

---

### Property 5: Edit updates task text

*For any* task and any non-empty trimmed string, calling `editTask(id, newText)` SHALL result in that task's `text` field being equal to the trimmed new text, and all other tasks SHALL remain unchanged.

**Validates: Requirements 3.4**

---

### Property 6: Delete removes exactly the targeted task

*For any* task list containing a task with a given `id`, calling `deleteTask(id)` SHALL produce a list that does not contain that `id`, with all other tasks preserved.

**Validates: Requirements 3.5**

---

### Property 7: Storage round-trip preserves task and link data

*For any* array of task objects (or link objects), serializing it to `localStorage` and then deserializing it SHALL produce an array that is structurally equal to the original.

**Validates: Requirements 3.6, 4.5**

---

### Property 8: Duplicate task is rejected (case-insensitive, trim-insensitive)

*For any* task text already present in the list, submitting the same text with any combination of leading/trailing whitespace or different letter casing SHALL be rejected by `isDuplicate(text)`, leaving the task array unchanged.

**Validates: Requirements 7.1**

---

### Property 9: Valid link is added

*For any* non-empty label string and non-empty URL string, calling `addLink(label, url)` SHALL increase the link array length by exactly one.

**Validates: Requirements 4.1**

---

### Property 10: Empty label or URL is rejected

*For any* call to `addLink` where label or URL is empty or whitespace-only, the link array SHALL remain unchanged.

**Validates: Requirements 4.2**

---

### Property 11: Theme toggle is an involution

*For any* initial theme value (`"light"` or `"dark"`), calling `toggleTheme()` twice SHALL restore the `<html>` element to its original theme class state.

**Validates: Requirements 5.2**

---

### Property 12: applyTheme sets the correct class

*For any* valid theme string (`"light"` or `"dark"`), `applyTheme(theme)` SHALL add the `dark` class to `<html>` when the theme is `"dark"` and SHALL remove it when the theme is `"light"`.

**Validates: Requirements 5.3**

---

### Property 13: Name save-and-load round trip

*For any* non-empty string, calling `saveName(text)` followed by `loadName()` SHALL return the trimmed version of that string.

**Validates: Requirements 6.1**

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Empty task input | Show inline error, do not add task |
| Duplicate task input | Show inline error "Task already exists", do not add task |
| Empty link label or URL | Show inline error, do not add link |
| `localStorage` parse error | Catch JSON.parse exception, default to `[]` or `""` |
| Timer already running | Guard with `if (timerId !== null) return` in `startTimer()` |

Error messages are displayed in a `<p>` element adjacent to the relevant input. They are cleared on the next valid submission.

## Testing Strategy

This feature is a client-side HTML/JS application. The recommended approach is:

**Unit tests (example-based)**
- Test `getGreeting(hour)` for boundary hours (0, 4, 5, 11, 12, 17, 18, 21, 22, 23).
- Test timer state transitions: initial state, start, pause, resume, reset, expire.
- Test `loadName` returns `""` when storage is empty, and the saved trimmed value when set.
- Test theme default (light) when no storage key is present.

**Property-based tests**
Use a property-based testing library suitable for vanilla JS (e.g., [fast-check](https://fast-check.dev/)) with a minimum of **100 iterations per property**.

Each property test references a design property using this tag format:
`// Feature: todo-life-dashboard, Property N: <property text>`

Properties to implement as property-based tests:
- Property 1 — `getGreeting` correctness (generate integer in [0, 23])
- Property 2 — valid task addition (generate arbitrary non-empty, non-whitespace strings)
- Property 3 — whitespace rejection (generate strings of only whitespace)
- Property 4 — toggle flips state (generate tasks with random `completed` values)
- Property 5 — edit updates text (generate tasks and new non-empty strings)
- Property 6 — delete removes target (generate lists and pick a random target id)
- Property 7 — storage round-trip (generate arrays of task/link objects)
- Property 8 — duplicate rejection (generate text, add it, then retry with trim/case variants)
- Property 9 — valid link addition (generate non-empty label and URL strings)
- Property 10 — empty link rejection (generate empty/whitespace label or URL)
- Property 11 — theme toggle involution
- Property 12 — applyTheme class correctness
- Property 13 — name save-and-load round trip

**Manual / accessibility checks**
- Verify `aria-label` attributes on icon-only buttons.
- Verify `target="_blank" rel="noopener noreferrer"` on all link anchors.
- Verify theme applies before first paint (script runs before body renders, or uses `<script>` in `<head>`).
- Verify timer shows completion indicator at 00:00.
