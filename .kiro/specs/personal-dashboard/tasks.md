# Implementation Plan: Personal Dashboard

## Overview

Build the Personal Dashboard as three files — `index.html`, `css/styles.css`, and `js/app.js` — using only Vanilla JavaScript and the browser's localStorage API. Implementation proceeds widget-by-widget, wiring each module into the single IIFE-wrapped app script, then applying responsive CSS last. Property-based tests validate the pure utility functions (formatters, validators, normalizers) in an inline `<script>` block or a small test runner file.

---

## Tasks

- [x] 1. Scaffold project structure and base HTML
  - Create `index.html` with the full semantic skeleton: `<html data-theme="light">`, `<head>` with FOUC-prevention inline script, `<link>` to `css/styles.css`, `<script defer>` pointing to `js/app.js`
  - Add `<header>` containing the theme toggle `<button id="theme-toggle">`
  - Add `<main>` with `<section id="greeting-widget">` (full-width) and `<div class="widget-grid">` containing three `<section>` elements: `#timer-widget`, `#todo-widget`, `#links-widget`
  - Create empty `css/styles.css` and empty `js/app.js` placeholder files
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.3, 6.4_

- [x] 2. Implement CSS theming and responsive layout
  - [x] 2.1 Write CSS custom properties and theme variables
    - Define `:root[data-theme="light"]` and `:root[data-theme="dark"]` colour tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-muted`, `--color-border`)
    - Apply tokens to `body`, `.widget`, `button`, `input`, `a` base styles
    - Set minimum `font-size: 14px` on body; ensure heading/label hierarchy
    - _Requirements: 5.1, 5.2, 7.4, 7.5_

  - [x] 2.2 Implement responsive widget grid
    - Default (mobile-first): `.widget-grid { display: flex; flex-direction: column; gap: 1rem; }`
    - `@media (min-width: 768px)` override: `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem`
    - Style `<header>` with sticky/fixed positioning for persistent theme toggle access
    - _Requirements: 6.1, 6.2, 5.1_

- [x] 3. Implement Theme Manager module
  - [x] 3.1 Write `getStoredTheme`, `applyTheme`, and `toggleTheme` functions
    - `getStoredTheme()` reads `localStorage.getItem('theme')` and defaults to `"light"`
    - `applyTheme(theme)` sets `document.documentElement.setAttribute('data-theme', theme)` and writes to localStorage
    - `toggleTheme()` reads current theme, flips it, calls `applyTheme`
    - Wire `#theme-toggle` click event to `toggleTheme` inside `initTheme()`
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 3.2 Write property test for theme toggle self-inverse (Property 18)
    - **Property 18: Theme toggle is self-inverse**
    - **Validates: Requirements 5.2**
    - For both `"light"` and `"dark"` starting values, assert that calling `toggleTheme()` twice restores the original `data-theme` attribute and localStorage value

  - [ ]* 3.3 Write property test for stored theme applied on load (Property 19)
    - **Property 19: Stored theme is applied on load**
    - **Validates: Requirements 5.4**
    - For each T ∈ `{"light", "dark"}`, set `localStorage.theme = T`, call `applyTheme(getStoredTheme())`, assert `document.documentElement.getAttribute("data-theme") === T`

- [ ] 4. Implement Greeting Widget module
  - [x] 4.1 Write `formatTime`, `formatDate`, and `getGreetingPhrase` pure functions
    - `formatTime(date)` → `"HH:MM"` (zero-padded hours and minutes)
    - `formatDate(date)` → `"DayName, DD MonthName YYYY"` (e.g., `"Monday, 27 July 2026"`)
    - `getGreetingPhrase(hour)` → `"Good Morning"` [5–11], `"Good Afternoon"` [12–17], `"Good Evening"` [18–20], `"Good Night"` [0–4, 21–23]
    - `buildGreetingText(phrase, name)` → `"phrase, name"` if name is non-empty; else `phrase`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ]* 4.2 Write property test for `formatTime` (Property 1)
    - **Property 1: Time formatting produces valid HH:MM output**
    - **Validates: Requirements 1.2**
    - Generate arbitrary Date objects; assert result matches `/^\d{2}:\d{2}$/`, hours ∈ [0,23], minutes ∈ [0,59]

  - [ ]* 4.3 Write property test for `formatDate` (Property 2)
    - **Property 2: Date formatting produces a human-readable string**
    - **Validates: Requirements 1.3**
    - Assert non-empty, contains a day name, numeric day, month name, and 4-digit year

  - [ ]* 4.4 Write property test for `getGreetingPhrase` (Property 3)
    - **Property 3: Greeting phrase is correct for every hour of the day**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**
    - Enumerate all 24 hours [0–23]; assert exact phrase per spec bucket

  - [ ]* 4.5 Write property test for `buildGreetingText` (Property 4)
    - **Property 4: Greeting text includes name when provided, excludes it when absent**
    - **Validates: Requirements 1.8, 1.9**
    - With non-empty name: result contains phrase and name; with empty/null name: result equals phrase

  - [~] 4.6 Wire up `initGreeting` and `tickGreeting`
    - Render time, date, and greeting text into `#greeting-widget` on load
    - Read `userName` from localStorage; show name input form; handle submit to save and re-render
    - Start `setInterval(tickGreeting, 60000)` to update time every 60 s without reload
    - _Requirements: 1.10, 1.11_

- [~] 5. Checkpoint — Greeting and Theme
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Focus Timer module
  - [ ] 6.1 Write `formatCountdown` and `validateDuration` pure functions
    - `formatCountdown(totalSeconds)` → `"MM:SS"` (zero-padded), e.g. `1500 → "25:00"`
    - `validateDuration(value)` → integer if value ∈ [1, 120], else `null`
    - _Requirements: 2.2, 2.5_

  - [ ]* 6.2 Write property test for `formatCountdown` (Property 5)
    - **Property 5: Countdown formatter produces valid MM:SS output**
    - **Validates: Requirements 2.2**
    - For totalSeconds ∈ [0, 7200]: result matches `/^\d{2}:\d{2}$/`; decoded value equals input

  - [ ]* 6.3 Write property test for `validateDuration` (Property 7)
    - **Property 7: Duration validator accepts valid values and rejects invalid ones**
    - **Validates: Requirements 2.5**
    - V ∈ [1,120] → returns V; V < 1, V > 120, or non-integer → returns null

  - [~] 6.4 Write `getStoredDuration`, `saveDuration`, timer state machine, and `initTimer`
    - `getStoredDuration()` reads `localStorage.pomodoroDuration`, defaults to `25`, clamps to [1, 120]
    - Timer state: `{ durationMinutes, remainingSeconds, timerId, isRunning }`
    - `startTimer()`, `stopTimer()`, `resetTimer()`, `tickTimer()` implement `idle → running → paused → idle` state machine
    - On completion: attempt `Notification` API; fall back to `alert()`
    - Disable duration input while running; enable on stop/reset
    - _Requirements: 2.3, 2.4, 2.6, 2.7, 2.8, 2.10, 2.11, 2.12_

  - [ ]* 6.5 Write property test for stored duration initialisation (Property 6)
    - **Property 6: Timer initialises to stored Pomodoro duration**
    - **Validates: Requirements 2.3, 2.4**
    - For D ∈ [1,120]: set localStorage, call `getStoredDuration()`, assert returns D; initial `remainingSeconds = D × 60`

  - [ ]* 6.6 Write property test for reset restores full duration (Property 8)
    - **Property 8: Reset restores full configured duration**
    - **Validates: Requirements 2.9**
    - After `startTimer()` + partial tick + `resetTimer()`, assert `remainingSeconds === durationMinutes * 60`

- [~] 7. Checkpoint — Timer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement To-Do List module
  - [~] 8.1 Write `loadTasks`, `saveTasks`, and `isValidTaskText` functions
    - `loadTasks()` parses `localStorage.tasks` JSON; catches parse errors and defaults to `[]`
    - `saveTasks(tasks)` serialises and writes; catches `QuotaExceededError`, shows inline error
    - `isValidTaskText(text)` returns `false` for empty or whitespace-only strings
    - _Requirements: 3.2, 3.3, 3.4, 3.10_

  - [ ]* 8.2 Write property test for task addition round-trip (Property 9)
    - **Property 9: Task addition round-trip persists to localStorage**
    - **Validates: Requirements 3.2, 3.3, 3.10**
    - `addTask(T)` → `loadTasks()` returns array with task where `text === T`

  - [ ]* 8.3 Write property test for empty task rejection (Property 10)
    - **Property 10: Empty or whitespace-only task text is rejected**
    - **Validates: Requirements 3.4**
    - Whitespace strings and `""` → `isValidTaskText` returns false; `addTask` does not mutate array

  - [~] 8.4 Write `addTask`, `toggleTask`, `editTask`, `deleteTask`, and `renderTasks`
    - `addTask(text)`: validates → creates `{ id: crypto.randomUUID(), text, completed: false }` → saves → renders
    - `toggleTask(id)`: flips `.completed` → saves → renders
    - `editTask(id, newText)`: validates → updates `.text` → saves → renders
    - `deleteTask(id)`: filters out by id → saves → renders
    - `renderTasks()`: builds DOM list; each item has complete-toggle, inline-edit, delete controls; completed tasks get strikethrough class
    - Inline validation message on empty submit
    - _Requirements: 3.3, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [ ]* 8.5 Write property test for toggle self-inverse (Property 11)
    - **Property 11: Task completion toggle is self-inverse**
    - **Validates: Requirements 3.7, 3.8**
    - `toggleTask(id)` twice → `completed` equals original; both persisted states verified

  - [ ]* 8.6 Write property test for edit task updates text (Property 12)
    - **Property 12: Edit task updates text in collection**
    - **Validates: Requirements 3.6**
    - `editTask(id, N)` → `loadTasks()` returns task with same id and `text === N`

  - [ ]* 8.7 Write property test for delete task removes from collection (Property 13)
    - **Property 13: Delete task removes it from collection**
    - **Validates: Requirements 3.9**
    - `deleteTask(I)` → `loadTasks()` has no task with `id === I`

  - [~] 8.8 Wire up `initTodo`
    - Calls `renderTasks()` on load; attaches submit handler to task-input form
    - _Requirements: 3.2_

- [~] 9. Checkpoint — To-Do List
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Quick Links module
  - [~] 10.1 Write `loadLinks`, `saveLinks`, `isValidLink`, and `normaliseUrl` functions
    - `loadLinks()` parses `localStorage.links`; catches parse error, defaults to `[]`
    - `saveLinks(links)` serialises; catches `QuotaExceededError`, shows inline error
    - `isValidLink(label, url)` returns `false` if either trim is empty
    - `normaliseUrl(url)` prepends `"https://"` unless url starts with `"http://"` or `"https://"`
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.8_

  - [ ]* 10.2 Write property test for link addition round-trip (Property 14)
    - **Property 14: Quick Link addition round-trip persists to localStorage**
    - **Validates: Requirements 4.2, 4.3, 4.8**
    - `addLink(L, U)` → `loadLinks()` returns array with link where `label === L`

  - [ ]* 10.3 Write property test for empty label/URL rejection (Property 15)
    - **Property 15: Empty label or URL is rejected**
    - **Validates: Requirements 4.4**
    - Empty label or empty URL → `isValidLink` returns false; `addLink` does not mutate array

  - [ ]* 10.4 Write property test for URL normalisation (Property 16)
    - **Property 16: URL normalisation always produces an absolute URL**
    - **Validates: Requirements 4.5**
    - URL without scheme → `normaliseUrl` returns `"https://" + url`; URL already with `http://`/`https://` → unchanged

  - [~] 10.5 Write `addLink`, `deleteLink`, `renderLinks`, and `initLinks`
    - `addLink(label, url)`: validates → normalises url → creates `{ id, label, url }` → saves → renders
    - `deleteLink(id)`: filters → saves → renders
    - `renderLinks()`: renders each link as `<a href target="_blank">` button with delete control; inline validation on empty submit
    - _Requirements: 4.3, 4.6, 4.7_

  - [ ]* 10.6 Write property test for delete link removes from collection (Property 17)
    - **Property 17: Delete Quick Link removes it from collection**
    - **Validates: Requirements 4.7**
    - `deleteLink(I)` → `loadLinks()` has no link with `id === I`

  - [~] 10.7 Wire up `initLinks`
    - Calls `renderLinks()` on load; attaches submit handler to add-link form
    - _Requirements: 4.2_

- [ ] 11. Final integration — wire all modules in `app.js`
  - [~] 11.1 Compose top-level `init()` function in `js/app.js`
    - Wrap entire script in an IIFE to avoid global scope pollution
    - Call `initTheme()`, `initGreeting()`, `initTimer()`, `initTodo()`, `initLinks()` from `DOMContentLoaded` listener
    - Verify all modules share no implicit globals; each module reads/writes only its own localStorage keys
    - _Requirements: 6.3, 6.4, 7.3_

  - [ ]* 11.2 Write integration smoke tests
    - Simulate page load sequence; assert all five widget sections are present in the DOM
    - Assert localStorage round-trips for tasks, links, theme, userName, pomodoroDuration work end-to-end
    - _Requirements: 7.1, 7.2_

- [~] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each major widget
- Property tests validate the pure utility functions and can be run in a minimal HTML test harness (no build tool required)
- Unit tests validate edge cases and error conditions
- The FOUC-prevention inline script in `<head>` must remain a raw `<script>` block (not deferred) so it runs synchronously before paint

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "4.3", "4.4", "4.5", "6.1"] },
    { "id": 4, "tasks": ["4.6", "6.2", "6.3", "8.1", "10.1"] },
    { "id": 5, "tasks": ["6.4", "8.2", "8.3", "10.2", "10.3", "10.4"] },
    { "id": 6, "tasks": ["6.5", "6.6", "8.4", "10.5"] },
    { "id": 7, "tasks": ["8.5", "8.6", "8.7", "8.8", "10.6", "10.7"] },
    { "id": 8, "tasks": ["11.1"] },
    { "id": 9, "tasks": ["11.2"] }
  ]
}
```
