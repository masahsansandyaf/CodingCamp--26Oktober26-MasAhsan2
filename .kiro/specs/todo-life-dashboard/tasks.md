# Implementation Plan: To-Do Life Dashboard

## Overview

Build a static, single-page dashboard with HTML, CSS, and vanilla JavaScript. No build step, no npm packages, no backend. All data persists in `localStorage`. The output is three files: `index.html`, `css/style.css`, and `js/script.js`, deployable directly to GitHub Pages.

## Tasks

- [x] 1. Build the HTML Structure and Styling
  - Create `todo-life-dashboard/index.html` with semantic HTML (header, main, section elements).
  - Add Tailwind CSS via CDN in the `<head>`.
  - Build the three-section responsive dashboard layout:
    - Header: greeting, date, time, name input, theme toggle button.
    - Main (two-column desktop / single-column mobile): To-Do List card + Focus Timer card.
    - Quick Links section: label/URL inputs, add button, link list.
  - Create `todo-life-dashboard/css/style.css` for minimal custom styles (dark mode CSS variables, any transitions Tailwind cannot handle).
  - Link `css/style.css` and `js/script.js` (deferred) in index.html.
  - Do NOT create additional CSS or JS files.
  - _Requirements: 1, 2, 3, 4, 5, 6, 7_

- [x] 2. Implement Core JavaScript Features
  - Create `todo-life-dashboard/js/script.js`.
  - Implement `updateClock()` via `setInterval` (1000ms): updates HH:MM:SS time and "Day, DD Month YYYY" date every second.
  - Implement `getGreeting(hour)`: returns the correct salutation for hours 0–23.
  - Implement timer: `startTimer()`, `pauseTimer()`, `resetTimer()`, `tick()`; use a single `timerId` variable to prevent multiple intervals; show a completion indicator at 00:00.
  - Implement tasks: `loadTasks()`, `saveTasks()`, `addTask()`, `toggleTask(id)`, `editTask(id)`, `deleteTask(id)`, `isDuplicate(text)`.
  - Persist tasks in `localStorage` under key `tdl_tasks` as `[{ id, text, completed }]`.
  - Reject empty/whitespace input; reject duplicates (trimmed, lowercased comparison) with an inline error message.
  - Wire all task UI events (add, toggle, edit, delete).
  - Call `init()` on `DOMContentLoaded`.
  - _Requirements: 1, 2, 3, 7_

- [x] 3. Implement Preferences and Quick Links
  - Implement links: `loadLinks()`, `saveLinks()`, `addLink()`, `deleteLink(id)`.
  - Persist links in `localStorage` under key `tdl_links` as `[{ id, label, url }]`.
  - Open links in a new tab with `target="_blank" rel="noopener noreferrer"`.
  - Reject empty label or empty URL with an inline error message.
  - Implement `saveName()` and `loadName()`: persist custom name under `tdl_name`; update greeting display immediately.
  - Implement `applyTheme(theme)` and `toggleTheme()`: toggle `dark` class on `<html>`; persist under `tdl_theme`; apply saved theme before first paint.
  - Default to light theme when no preference is stored.
  - Wire all link, name, and theme UI events.
  - _Requirements: 4, 5, 6_

- [x] 4. Final Review and Deployment Readiness
  - Open `index.html` directly in a browser (file:// or local server) and verify all sections render correctly.
  - Confirm all seven features work: greeting/time/date, timer, tasks, quick links, light/dark mode, custom name, duplicate prevention.
  - Fix any broken relative paths, missing event listeners, or layout issues found.
  - Verify the app works as a static site with no build step required.
  - Create `todo-life-dashboard/.gitignore` (ignore OS files like .DS_Store, Thumbs.db).
  - Create `todo-life-dashboard/README.md` with a brief description and manual verification checklist:
    1. Time and date update every second.
    2. Greeting changes based on time of day.
    3. Timer starts, pauses, resumes, resets, and shows completion at 00:00.
    4. Tasks can be added, completed, edited, deleted; duplicates are rejected.
    5. Quick links can be added, opened in a new tab, and deleted.
    6. Theme toggle switches and persists across reloads.
    7. Custom name persists and appears in greeting.
    8. All data survives a page reload.
  - _Requirements: 1, 2, 3, 4, 5, 6, 7_

## Notes

- Tasks 1–3 are sequential: HTML structure must exist before JS can wire up DOM elements.
- Task 4 is a manual review and cleanup step; it produces `.gitignore` and `README.md` as its only new files.
- No test framework or additional dependencies are introduced — this is a zero-build-step project.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4"] }
  ]
}
```
