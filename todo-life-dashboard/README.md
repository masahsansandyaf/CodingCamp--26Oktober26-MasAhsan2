# To-Do Life Dashboard

A static, single-page personal productivity hub built with HTML, Tailwind CSS, and Vanilla JavaScript — no build step required.

## Features

- **Live clock & greeting** — displays current time (HH:MM:SS), full date, and a time-based salutation (Morning / Afternoon / Evening / Night)
- **Custom name** — personalize the greeting with your name, saved across reloads
- **Pomodoro focus timer** — 25-minute countdown with Start, Pause, and Reset controls
- **To-do list** — add, complete, edit, and delete tasks with full localStorage persistence
- **Duplicate prevention** — rejects tasks that already exist (case-insensitive)
- **Quick links** — save and open favorite URLs in a new tab; links persist across reloads
- **Light / Dark mode** — theme toggle that persists your preference across reloads

## How to Run

Open `index.html` directly in any modern browser — no server, no build step, no dependencies to install.

```
todo-life-dashboard/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages** in your repository.
3. Under **Source**, select the branch (e.g. `main`) and set the folder to `/ (root)` or `/docs` depending on where `index.html` lives.
4. Save — GitHub Pages will serve the app within a minute.

> If `todo-life-dashboard/` is a subdirectory of a larger repo, point the Pages source to that subdirectory or copy its contents to the repo root / a `/docs` folder.

## Manual Verification Checklist

Go through each item after opening `index.html` in a browser:

- [ ] Time (HH:MM:SS) updates every second.
- [ ] Date shows day name, numeric date, month name, and year.
- [ ] Greeting changes to Morning / Afternoon / Evening / Night based on the current hour.
- [ ] Focus Timer starts counting down when Start is clicked.
- [ ] Focus Timer pauses and resumes correctly (time is preserved).
- [ ] Focus Timer resets to 25:00 when Reset is clicked.
- [ ] Timer shows "Session complete!" at 00:00 and the Start button becomes disabled.
- [ ] Tasks can be added with the input field (Enter or Add button).
- [ ] Completed tasks show a strikethrough style.
- [ ] Tasks can be edited inline and saved.
- [ ] Tasks can be deleted.
- [ ] Duplicate tasks (case-insensitive) are rejected with an inline error message.
- [ ] Empty task input is rejected with an inline error message.
- [ ] Quick links can be added with a label and URL.
- [ ] Quick links open in a new browser tab.
- [ ] Quick links can be deleted.
- [ ] Empty label or URL is rejected with an inline error message.
- [ ] Light/Dark toggle switches the theme immediately and persists across page reloads.
- [ ] Custom name appears in the greeting (e.g. "Good Morning, Alex!") and persists across reloads.
- [ ] Clearing the name field and saving removes the name from the greeting.
- [ ] All data (tasks, links, name, theme) survives a full page reload.
