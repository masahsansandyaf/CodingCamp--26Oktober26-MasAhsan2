# Requirements Document

## Introduction

The To-Do Life Dashboard is a static, single-page web application built with HTML, CSS, and Vanilla JavaScript. It serves as a personal productivity hub with a live clock and greeting, a Pomodoro focus timer, a persistent to-do list, a quick-links panel, and a light/dark theme toggle. All user data is stored in the browser's Local Storage with no backend. The application uses Tailwind CSS via CDN, exactly one CSS file (`css/style.css`), and exactly one JavaScript file (`js/script.js`), and is deployable to GitHub Pages without a build system.

## Glossary

- **Dashboard**: The single-page web application as a whole.
- **Clock**: The UI component that displays the current time and date.
- **Greeting**: The section that shows a time-based salutation and an optional custom user name.
- **Timer**: The Pomodoro focus timer component managing a 25-minute countdown.
- **Task_List**: The component responsible for creating, displaying, completing, editing, and deleting tasks.
- **Task**: A single to-do item consisting of a text label and a completion state.
- **Link_Panel**: The component responsible for adding, displaying, and deleting quick-access website links.
- **Link**: A single quick-access entry consisting of a label and a URL.
- **Storage**: The browser's `localStorage` API used to persist all user data.
- **Theme**: The active color scheme of the Dashboard, either light or dark.

---

## Requirements

### Requirement 1: Greeting, Time, and Date

**User Story:** As a user, I want to see the current time, date, and a time-based greeting so I have an at-a-glance sense of the time of day.

#### Acceptance Criteria

1. THE Clock SHALL display the current time in HH:MM:SS format and update every second.
2. THE Clock SHALL display the current date including the day name, numeric date, month name, and year.
3. IF the local hour is between 05 and 11 (inclusive), THEN THE Greeting SHALL display "Good Morning".
4. IF the local hour is between 12 and 17 (inclusive), THEN THE Greeting SHALL display "Good Afternoon".
5. IF the local hour is between 18 and 21 (inclusive), THEN THE Greeting SHALL display "Good Evening".
6. IF the local hour is between 22 and 23 or between 00 and 04 (inclusive), THEN THE Greeting SHALL display "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute Pomodoro timer with Start, Pause, and Reset so I can manage focused work sessions.

#### Acceptance Criteria

1. THE Timer SHALL initialize with a display of 25:00 in MM:SS format.
2. WHEN the user activates the Start control, THE Timer SHALL begin counting down one second per second.
3. WHEN the Timer is running and the user activates the Pause control, THE Timer SHALL stop the countdown and preserve the remaining time.
4. WHEN the Timer is paused and the user activates the Start control, THE Timer SHALL resume the countdown from the preserved remaining time.
5. WHEN the user activates the Reset control, THE Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Timer SHALL stop automatically and display a completion indicator.
7. THE Timer SHALL ensure only one countdown interval is active at a time.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to add, edit, complete, and delete tasks that persist across sessions so I can track my work.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task text, THE Task_List SHALL add a new Task with the trimmed text and save it to Storage immediately.
2. IF the user submits empty or whitespace-only task text, THEN THE Task_List SHALL reject the submission without adding a Task.
3. WHEN the user toggles the completion control on a Task, THE Task_List SHALL update the Task's completion state, apply a distinct visual style (e.g., strikethrough), and persist the change to Storage.
4. WHEN the user activates the edit control on a Task and confirms non-empty trimmed text, THE Task_List SHALL update the Task's text and persist the change to Storage.
5. WHEN the user activates the delete control on a Task, THE Task_List SHALL remove that Task from the list and from Storage.
6. WHEN the Dashboard loads, THE Task_List SHALL read Tasks from Storage and render all previously saved Tasks.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and open favorite website links from the dashboard so I can navigate quickly.

#### Acceptance Criteria

1. WHEN the user submits a non-empty label and a non-empty URL, THE Link_Panel SHALL add a new Link and save it to Storage.
2. IF the user submits an empty label or an empty URL, THEN THE Link_Panel SHALL reject the submission without adding a Link.
3. WHEN the user activates a Link, THE Dashboard SHALL open the Link's URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Link_Panel SHALL remove that Link from the panel and from Storage.
5. WHEN the Dashboard loads, THE Link_Panel SHALL read Links from Storage and render all previously saved Links.

---

### Requirement 5: Light/Dark Mode

**User Story:** As a user, I want to toggle between light and dark modes with my preference saved so the dashboard suits my environment across reloads.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control to switch between light and dark Theme.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL apply the selected Theme to all visible UI elements immediately and persist the value to Storage.
3. WHEN the Dashboard loads, THE Dashboard SHALL read the saved Theme from Storage and apply it before content is painted.
4. IF no Theme preference is found in Storage, THEN THE Dashboard SHALL apply the light Theme by default.

---

### Requirement 6: Custom Greeting Name

**User Story:** As a user, I want to enter my name so the greeting is personalized.

#### Acceptance Criteria

1. WHEN the user submits a non-empty name, THE Dashboard SHALL save the trimmed name to Storage and display it in the Greeting (e.g., "Good Morning, Alex!").
2. WHEN the user clears the name field and submits, THE Dashboard SHALL remove the saved name from Storage and display the Greeting without a name.

---

### Requirement 7: Duplicate-Task Prevention

**User Story:** As a user, I want the dashboard to prevent duplicate tasks so my list stays clean.

#### Acceptance Criteria

1. IF the trimmed, lowercased text of a submitted task matches the trimmed, lowercased text of any existing Task, THEN THE Task_List SHALL reject the submission without adding a Task.
2. WHEN a duplicate is detected, THE Task_List SHALL display an inline validation message indicating that the task already exists.
