# Implementation Plan: Life Dashboard (Dasbor Kehidupan)

## Overview

Life Dashboard is a single-page web app built with plain HTML, CSS, and Vanilla JavaScript — no frameworks, no external runtime libraries, no build step, and no test tooling. The implementation follows a pure/impure separation: all input-dependent logic (time formatting, greeting selection, timer state transitions, task/link validation, duplicate-task detection, task sorting, theme normalization, and serialization) is written as plain functions in a single `js/app.js` file, while side effects (DOM updates, `setInterval`, `localStorage`) live in controller functions within the same file. The script is loaded with a regular `<script src="./js/app.js"></script>` tag (no `type="module"`), so the functions are regular script-level functions that do not need to be exported. All assets use relative paths so the app deploys cleanly as a static site to GitHub Pages. Verification is performed through manual, browser-based checks as described in the design.

The dashboard also includes a Theme Toggle (switching between light and dark color themes), duplicate-task prevention (rejecting tasks whose description matches an existing task), and a Sort Control (reordering the displayed to-do list). All three reuse the same fault-tolerant Storage adapter for persistence, and `sortTasks` is a view-only transformation that never reassigns task ids or mutates the stored list.

## Tasks

- [ ] 1. Set up project structure and base files
  - [ ] 1.1 Create folder structure and base files
    - Create the `css/` directory, the `js/` directory, and `index.html` at the project root
    - Create `js/app.js` as an empty script (no `export`s, no `type="module"`) organized with logical section comments for Greeting, Timer, To-Do, Quick Links, Storage, Theme, Sort, Controllers, and init
    - Create `css/style.css` as an empty placeholder
    - Create `index.html` referencing `./css/style.css` and `./js/app.js` with relative paths (no leading slash) using a plain `<script src="./js/app.js"></script>` tag (no `type="module"`)
    - _Requirements: 12.1, 12.3, 12.4, 16.1, 16.2, 16.3_

- [ ] 2. Create HTML structure
  - [ ] 2.1 Create index.html with widget sections and relative asset paths
    - In `index.html`, create visually distinct sections for the Greeting Widget (time, date, and greeting text nodes), Focus Timer (display node, start/stop/reset buttons, completion message node), To-Do List (input field, add button, list container), and Quick Links (name input, URL input, add button, error indicator, link button container)
    - Give each interactive element a unique id so the controllers can query it by id
    - Reference `./css/style.css` and `./js/app.js` with relative paths (no leading slash); place the plain script tag so the app initializes on `DOMContentLoaded`
    - _Requirements: 12.1, 15.1, 16.3, 17.3_

- [ ] 3. Create CSS styling
  - [ ] 3.1 Create css/style.css with visual design
    - In `css/style.css`, style visually distinct widget sections separated by at least 16px gaps between adjacent widgets
    - Set body text font-size to at least 16px and maintain a minimum text-to-background contrast ratio of 4.5:1 across all widgets
    - Render each widget heading larger or bolder than its body content
    - Add a strikethrough style for done tasks, completion message styling for the Focus Timer, and error indication styling for invalid quick link input
    - _Requirements: 7.2, 15.1, 15.2_

- [ ] 4. Implement Greeting Widget logic
  - [ ] 4.1 Implement time, date, and greeting functions
    - In `js/app.js`, implement `formatTime(date)` returning `"HH:MM:SS"` zero-padded
    - Implement `formatDate(date)` returning `"<DayName>, <DayOfMonth> <MonthName> <Year>"` using explicit Indonesian day-of-week and month name arrays (not `Intl.DateTimeFormat`)
    - Implement `getGreetingWord(date)` returning `"pagi"`, `"siang"`, `"sore"`, or `"malam"` based on hour; define greeting period boundaries by hour: 05–11 → `"pagi"`, 12–14 → `"siang"`, 15–18 → `"sore"`, 19–04 (wraps midnight) → `"malam"`
    - Implement `buildGreetingText(word)` returning a display string containing the greeting word
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Implement Focus Timer logic
  - [ ] 5.1 Implement timer state machine and display formatting
    - In `js/app.js`, define `FOCUS_DURATION_SECONDS = 1500` and `INITIAL_TIMER_STATE = { isRunning: false, remainingSeconds: 1500 }`
    - Implement `formatTimerDisplay(totalSeconds)` returning `"MM:SS"` zero-padded
    - Implement `reduceTimerState(state, action)` as a pure reducer with actions: `"start"` begins only when `!isRunning && remainingSeconds > 0`; `"stop"` pauses only when `isRunning`; `"reset"` always returns `{ isRunning: false, remainingSeconds: 1500 }`; `"tick"` decrements `remainingSeconds` by 1 while running and `remainingSeconds > 1`, stops at 0 when `remainingSeconds == 1`, and is a no-op when not running
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 6. Implement To-Do List logic
  - [ ] 6.1 Implement task validation, creation, mutation, and serialization
    - In `js/app.js`, define `MAX_TASK_DESCRIPTION_LENGTH = 200`
    - Implement `validateTaskDescription(text)` returning `true` iff the text contains at least one non-whitespace character and its length is ≤ 200
    - Implement `createTask(text)` returning `{ id, description: text, done: false }` with id via `crypto.randomUUID()` and a timestamp+random fallback
    - Implement `toggleTaskStatus(task)` returning a copy with `done` negated
    - Implement `updateTaskDescription(task, text)` returning a copy with the new description if valid (preserving `done`), else returning the original task unchanged
    - Implement `deleteTask(tasks, id)` returning a new list without the matching task, preserving the order of all others
    - Implement `serializeTasks(tasks)` returning a JSON string, and `deserializeTasks(raw)` returning the parsed list or `[]` for null, empty, or unparseable input
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.2, 6.3, 7.1, 8.1, 9.2, 9.3, 9.5_

- [ ] 7. Implement Quick Links logic
  - [ ] 7.1 Implement link validation, creation, deletion, and serialization
    - In `js/app.js`, implement `validateQuickLink(name, url)` returning `true` iff the name has at least one non-whitespace character, the url has at least one non-whitespace character, and the url starts with `http://` or `https://`
    - Implement `createQuickLink(name, url)` returning `{ id, name, url }` with a unique id via `crypto.randomUUID()` and a timestamp+random fallback
    - Implement `deleteLink(links, id)` returning a new list without the matching link, preserving the order of all others
    - Implement `serializeLinks(links)` returning a JSON string, and `deserializeLinks(raw)` returning the parsed list or `[]` for null, empty, or unparseable input
    - _Requirements: 10.3, 10.4, 10.5, 11.2, 11.3_

- [ ] 8. Implement Storage Adapter
  - [ ] 8.1 Implement fault-tolerant localStorage wrapper
    - In `js/app.js`, implement `isStorageAvailable()` probing `localStorage` with a test write/remove, catching exceptions
    - Implement `safeSave(key, value)` saving only if available, catching and swallowing errors, returning a success boolean without ever clearing in-memory state
    - Implement `safeLoad(key)` returning the stored value or `null` on any failure or absence
    - Define storage keys `"life-dashboard:tasks"`, `"life-dashboard:links"`, `"life-dashboard:theme"`, and `"life-dashboard:sort-mode"`, reusing the same wrapper for task, link, theme, and sort-mode persistence
    - _Requirements: 9.1, 9.4, 11.1, 18.2, 18.3, 20.4, 20.5_

- [ ] 9. Implement DOM controllers
  - [ ] 9.1 Implement all four DOM controllers
    - Greeting Widget controller: subscribe to a 1-second `setInterval` clock, call `formatTime`/`formatDate`/`getGreetingWord`/`buildGreetingText`, and write the strings into the DOM nodes; update within 1 second of time, date, and greeting changes, including when crossing a greeting period boundary
    - Focus Timer controller: own its own `setInterval`, dispatch `tick` each second while running via `reduceTimerState`, render `formatTimerDisplay`, handle start/stop/reset button events, and show/hide the completion message when the state reaches 0
    - To-Do List controller: render the task list (applying the active Sort_Mode via `sortTasks` so the displayed order follows the selected mode while the underlying list keeps creation order), wire add/edit/toggle/delete controls, call `safeSave` on every mutation, load from `safeLoad` on init, apply strikethrough style for done tasks, clear the input field only on a successful add, and support entering and exiting edit mode with cancel
    - Enforce duplicate detection in the To-Do List controller using `isDuplicateTask`: on a duplicate add, do not add the task, retain the submitted text in the input field, and show a visible error indication; on a duplicate edit, retain the original Task description, keep the Task in the editable state, and show a visible error indication
    - Quick Links controller: render link buttons, open the URL via `window.open(url, "_blank", "noopener")` on click, wire add/delete controls, show an error indication on invalid input, call `safeSave` on every mutation, and load from `safeLoad` on init
    - _Requirements: 1.3, 1.4, 2.5, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 6.1, 6.4, 7.2, 9.1, 9.2, 10.1, 10.2, 10.4, 10.5, 11.1, 11.2, 19.1, 19.2, 20.3_

- [ ] 10. Wire everything together
  - [ ] 10.1 Implement initApp and load on DOMContentLoaded
    - In `js/app.js`, implement an `initApp()` function that sets up the shared 1-second clock, initializes the Focus Timer state to `INITIAL_TIMER_STATE`, loads tasks and links from storage via `safeLoad`/`deserializeTasks`/`deserializeLinks`, renders the initial state of all four widgets, and attaches all event listeners
    - In `initApp()`, also initialize the Theme Controller by loading the saved theme via the Storage adapter, normalizing and applying it (defaulting to the light theme when the saved value is missing or invalid), and attaching the theme toggle event listener; initialize the Sort Controller by loading the saved Sort_Mode via the Storage adapter, normalizing and applying it (defaulting to the creation order when the saved value is missing or invalid), setting the Sort_Control to reflect it, and attaching the sort mode change event listener
    - Register `initApp()` to run on `DOMContentLoaded` so the app starts when the page loads
    - Ensure the To-Do input rejects empty/whitespace and over-long input and the input field is cleared only on a successful add; ensure invalid quick link input is rejected with an error indication
    - _Requirements: 1.1, 1.3, 3.1, 5.1, 5.3, 5.4, 6.1, 6.4, 8.1, 9.2, 10.1, 10.5, 11.2, 18.3, 18.4, 20.5, 20.6_

- [ ] 11. Implement Theme Controller logic
  - [ ] 11.1 Implement normalizeTheme, isThemeValue, and theme controller behavior
    - In `js/app.js`, implement `normalizeTheme(value)` returning `"light"` or `"dark"` when `value` matches one of them (case-sensitive), and `"light"` (the default) for any other value including `null`
    - Implement `isThemeValue(value)` returning `true` iff `value` is `"light"` or `"dark"`
    - Implement the theme controller: an `applyTheme(theme)` function that sets `data-theme="light"` or `data-theme="dark"` on the root element (`<html>`); a `toggleTheme()` function that flips the active theme, applies it to the DOM, saves it via the Storage adapter under `"life-dashboard:theme"`, and updates a visible indicator distinguishing the active theme from the inactive one; and an `initTheme()` function that reads the saved theme via `safeLoad`, normalizes it via `normalizeTheme`, and applies it (defaulting to light when missing or invalid)
    - If a save fails or storage is unavailable, retain the currently displayed theme without reverting it
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [ ] 12. Add theme toggle and sort control to HTML
  - [ ] 12.1 Add theme toggle button and Sort_Control to index.html
    - In `index.html`, add a theme toggle button with a visible indicator that distinguishes the currently active theme, and give it a unique id
    - Place the Sort_Control inside the To-Do List section as a `select` element offering the `"status"` and `"creation"` Sort_Modes, and give it a unique id
    - Ensure both elements are queryable by the controllers via their ids
    - _Requirements: 18.1, 18.5, 20.1, 20.2_

- [ ] 13. Add light/dark theme CSS
  - [ ] 13.1 Add light/dark theme CSS variables keyed on data-theme
    - In `css/style.css`, define color theme variables for the light and dark themes keyed on the `data-theme` attribute of the root element (e.g. `[data-theme="light"]` and `[data-theme="dark"]`), and have all widget styling consume these variables
    - Ensure both themes maintain a minimum text-to-background contrast ratio of 4.5:1 and a minimum body text font size of 16px across all widgets
    - Provide distinct visible styling for the active theme indicator on the toggle so the active theme is distinguishable from the inactive one
    - _Requirements: 15.2, 18.1, 18.5_

- [ ] 14. Implement duplicate task detection
  - [ ] 14.1 Implement isDuplicateTask function
    - In `js/app.js`, implement `isDuplicateTask(tasks, text, excludeId)` returning `true` iff some Task in `tasks` (other than the one whose id equals `excludeId`) has a description equal to `text` after trimming leading/trailing whitespace and ignoring case
    - Add passes no `excludeId` so a new Task is checked against all existing Tasks; edit passes the id of the Task being edited so a Task is never flagged as a duplicate of itself
    - _Requirements: 19.1, 19.2_

- [ ] 15. Implement task sorting logic
  - [ ] 15.1 Implement sortTasks function
    - In `js/app.js`, implement `sortTasks(tasks, sortMode)` returning a new array used for display only, without mutating the underlying tasks array or reassigning task ids
    - For `sortMode` `"creation"`, return a copy of the Tasks in original creation order; for `sortMode` `"status"`, return not-done Tasks first followed by done Tasks, preserving creation order within each status group
    - _Requirements: 20.2, 20.3_

- [ ] 16. Implement Sort Controller
  - [ ] 16.1 Implement Sort Controller
    - In `js/app.js`, implement the Sort Controller: render the Sort_Control with the `"status"` and `"creation"` Sort_Modes; when the User selects a mode, store it under `"life-dashboard:sort-mode"` via the Storage adapter and trigger a re-render of the To-Do List through `sortTasks` using the selected mode
    - On load, read the saved Sort_Mode via `safeLoad`, normalize it (defaulting to `"creation"` when missing or invalid), apply it to the displayed Tasks, and set the Sort_Control to reflect it
    - If the Storage adapter is unavailable or a save fails, retain the selected Sort_Mode for the current session and display a visible error indication to the User
    - _Requirements: 20.1, 20.3, 20.4, 20.5, 20.6, 20.7_

## Notes

- Each task references specific requirements for traceability
- All JavaScript lives in a single `js/app.js` file per Requirement 16, loaded with a plain `<script src="./js/app.js"></script>` tag (no `type="module"`, no build step)
- Pure functions (Greeting, Timer, To-Do, Quick Links, theme, duplicate-detection, and sorting logic) are kept separate from side-effecting controllers for readability, but are not exported — they are regular script-level functions
- Tasks 11–16 cover the Theme Toggle (Requirement 18), duplicate task prevention (Requirement 19), and task sorting (Requirement 20) added to the requirements and design; tasks 1–10 were updated where needed to reference the new storage keys, duplicate checking, and sort-on-render behavior
- The Storage adapter is reused for theme and sort-mode persistence via the same `safeSave`/`safeLoad` wrapper and the new storage keys `"life-dashboard:theme"` and `"life-dashboard:sort-mode"`
- `sortTasks` is a view-only transformation; the underlying tasks array keeps creation order as the canonical order, so reordering never reassigns task ids or mutates stored data
- No automated test tooling, test runner, devDependencies, or package.json is introduced; the deployed app remains framework-free and dependency-free (Requirement 12)
- Manual verification items (cross-browser rendering, performance thresholds, deployment to GitHub Pages) are documented in the design but are not coding tasks and are excluded from this plan

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1"] },
    { "id": 2, "tasks": ["5.1", "12.1"] },
    { "id": 3, "tasks": ["6.1", "13.1"] },
    { "id": 4, "tasks": ["7.1"] },
    { "id": 5, "tasks": ["14.1"] },
    { "id": 6, "tasks": ["15.1"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["11.1"] },
    { "id": 9, "tasks": ["9.1"] },
    { "id": 10, "tasks": ["16.1"] },
    { "id": 11, "tasks": ["10.1"] }
  ]
}
```
