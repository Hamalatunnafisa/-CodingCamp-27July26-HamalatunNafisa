# Design Document

## Introduction

This document describes the architecture, component structure, data models, and correctness properties for the Personal Dashboard — a single-page, client-side productivity web application built with HTML, CSS, and Vanilla JavaScript.

---

## Architecture Overview

The application follows a **module-per-widget** pattern inside a single JavaScript file (`js/app.js`). There is no build step, no bundler, and no external dependencies. All state is derived from `localStorage` on page load and written back immediately on every mutation.

```
index.html
├── css/
│   └── styles.css          (single stylesheet)
└── js/
    └── app.js              (single script, IIFE-wrapped modules)
```

### Runtime Flow

```
Page Load
  │
  ├─► applyTheme()           ← reads localStorage, sets data-theme attribute
  ├─► initGreeting()         ← reads userName, renders time/date/greeting, starts 60s tick
  ├─► initTimer()            ← reads pomodoroDuration, renders MM:SS countdown
  ├─► initTodo()             ← reads tasks[], renders task list
  └─► initLinks()            ← reads links[], renders link buttons

User Action
  │
  ├─► widget handler mutates in-memory state
  ├─► persist() writes updated value to localStorage
  └─► render() updates the DOM
```

---

## Component Design

### 1. Theme Manager

Responsible for reading and writing the `theme` key in localStorage and toggling the `data-theme` attribute on `<html>`.

**Key functions:**
```javascript
// Returns stored theme or "light"
function getStoredTheme() → "light" | "dark"

// Sets data-theme on <html> and writes to localStorage
function applyTheme(theme) → void

// Reads current theme, flips it, calls applyTheme
function toggleTheme() → void
```

**Inline script in `<head>`** (prevents FOUC):
```html
<script>
  (function() {
    var t = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

---

### 2. Greeting Widget

Handles time/date display and personalised greeting.

**Key functions:**
```javascript
// Returns "Good Morning" | "Good Afternoon" | "Good Evening" | "Good Night"
function getGreetingPhrase(hour) → string

// Returns "HH:MM" from a Date object
function formatTime(date) → string

// Returns e.g. "Monday, 27 July 2026" from a Date object
function formatDate(date) → string

// Combines greeting phrase + optional name
function buildGreetingText(phrase, name) → string

// Reads DOM, localStorage; wires up name-input submit; starts setInterval(tick, 60000)
function initGreeting() → void

// Called by interval; updates time display
function tickGreeting() → void
```

**Time-of-day buckets:**

| Hour range | Phrase |
|---|---|
| 05:00 – 11:59 | Good Morning |
| 12:00 – 17:59 | Good Afternoon |
| 18:00 – 20:59 | Good Evening |
| 21:00 – 04:59 | Good Night |

---

### 3. Focus Timer

Manages countdown state machine: `idle → running → paused → idle`.

**State:**
```javascript
{
  durationMinutes: number,   // from localStorage or default 25
  remainingSeconds: number,  // current countdown value
  timerId: number | null,    // setInterval handle
  isRunning: boolean
}
```

**Key functions:**
```javascript
// Returns stored duration in minutes (default 25, clamped 1-120)
function getStoredDuration() → number

// Returns "MM:SS" string from total seconds
function formatCountdown(totalSeconds) → string

// Validates and returns integer value in [1, 120] or null
function validateDuration(value) → number | null

// Starts setInterval, updates state.isRunning, disables input
function startTimer() → void

// Clears interval, keeps remainingSeconds, enables input
function stopTimer() → void

// Clears interval, sets remainingSeconds = durationMinutes * 60, updates display
function resetTimer() → void

// Called each second; decrements remainingSeconds; fires alert at 00:00
function tickTimer() → void

// Persists durationMinutes to localStorage
function saveDuration(minutes) → void

function initTimer() → void
```

**Completion alert:** Uses `Notification` API if permission is granted; falls back to `alert()` dialog.

---

### 4. To-Do List

Manages an array of Task objects in memory and localStorage.

**Data Model:**
```javascript
// Task
{
  id: string,          // crypto.randomUUID() or Date.now().toString()
  text: string,        // task description
  completed: boolean   // completion status
}
```

**Key functions:**
```javascript
// Loads tasks from localStorage (default [])
function loadTasks() → Task[]

// Writes tasks array to localStorage
function saveTasks(tasks) → void

// Returns true if text is non-empty after trim
function isValidTaskText(text) → boolean

// Adds new task; saves; re-renders
function addTask(text) → void

// Flips task.completed; saves; re-renders
function toggleTask(id) → void

// Replaces task.text; saves; re-renders
function editTask(id, newText) → void

// Removes task by id; saves; re-renders
function deleteTask(id) → void

// Generates DOM nodes for task list from current tasks[]
function renderTasks() → void

function initTodo() → void
```

---

### 5. Quick Links

Manages an array of Link objects.

**Data Model:**
```javascript
// Link
{
  id: string,     // crypto.randomUUID() or Date.now().toString()
  label: string,  // display name
  url: string     // fully-qualified URL
}
```

**Key functions:**
```javascript
function loadLinks() → Link[]
function saveLinks(links) → void

// Returns true if label.trim() !== "" and url.trim() !== ""
function isValidLink(label, url) → boolean

// Prepends "https://" if url doesn't start with http:// or https://
function normaliseUrl(url) → string

function addLink(label, url) → void
function deleteLink(id) → void
function renderLinks() → void
function initLinks() → void
```

---

## Data Models (localStorage Keys)

| Key | Type | Description |
|---|---|---|
| `theme` | `"light"` \| `"dark"` | Current theme preference |
| `userName` | `string` | User's display name |
| `pomodoroDuration` | `number` (string-encoded) | Work session length in minutes |
| `tasks` | `JSON string` of `Task[]` | Array of to-do items |
| `links` | `JSON string` of `Link[]` | Array of quick link objects |

---

## HTML Structure

```
<html data-theme="light|dark">
  <head>
    <!-- FOUC-prevention inline script -->
    <!-- styles.css link -->
  </head>
  <body>
    <header>
      <!-- theme toggle button -->
    </header>

    <main>
      <!-- Greeting Widget (full-width) -->
      <section id="greeting-widget"> … </section>

      <!-- 3-column grid -->
      <div class="widget-grid">
        <section id="timer-widget">   … </section>
        <section id="todo-widget">    … </section>
        <section id="links-widget">   … </section>
      </div>
    </main>
  </body>
</html>
```

---

## CSS Architecture

Single file `css/styles.css` using CSS custom properties for theming:

```css
:root[data-theme="light"] {
  --color-bg:        #f5f5f5;
  --color-surface:   #ffffff;
  --color-text:      #1a1a1a;
  --color-accent:    #4a90d9;
  --color-muted:     #6b7280;
  --color-border:    #e0e0e0;
}

:root[data-theme="dark"] {
  --color-bg:        #121212;
  --color-surface:   #1e1e1e;
  --color-text:      #f0f0f0;
  --color-accent:    #64b5f6;
  --color-muted:     #9ca3af;
  --color-border:    #2e2e2e;
}
```

**Responsive breakpoint:**
```css
/* Desktop: 3-column grid */
@media (min-width: 768px) {
  .widget-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
  }
}

/* Mobile: single column (default/no query needed) */
.widget-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## Error Handling

| Scenario | Handling |
|---|---|
| `localStorage` parse error (corrupted JSON) | Catch `JSON.parse` error; fall back to empty array `[]` |
| `localStorage` quota exceeded | Catch `QuotaExceededError`; show inline error message to user |
| Notification API not available | Fall back to `alert()` |
| Notification permission denied | Fall back to `alert()` |
| Invalid duration input (non-integer, out of range) | Show inline validation message; do not update state |
| Empty task / empty link fields | Show inline validation message; reject submission |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time formatting produces valid HH:MM output

*For any* Date object, `formatTime(date)` SHALL return a string that matches the regular expression `^\d{2}:\d{2}$`, where the hours component is in [00, 23] and the minutes component is in [00, 59].

**Validates: Requirements 1.2**

---

### Property 2: Date formatting produces a human-readable string

*For any* Date object, `formatDate(date)` SHALL return a non-empty string that contains a recognisable day name, a numeric day, a month name, and a four-digit year.

**Validates: Requirements 1.3**

---

### Property 3: Greeting phrase is correct for every hour of the day

*For any* integer hour in [0, 23], `getGreetingPhrase(hour)` SHALL return exactly:
- `"Good Morning"` when hour ∈ [5, 11]
- `"Good Afternoon"` when hour ∈ [12, 17]
- `"Good Evening"` when hour ∈ [18, 20]
- `"Good Night"` when hour ∈ {0, 1, 2, 3, 4, 21, 22, 23}

**Validates: Requirements 1.4, 1.5, 1.6, 1.7**

---

### Property 4: Greeting text includes name when provided, excludes it when absent

*For any* greeting phrase string and any non-empty name string, `buildGreetingText(phrase, name)` SHALL return a string that contains both the phrase and the name. When name is empty or null, the return value SHALL equal the phrase without any trailing comma or suffix.

**Validates: Requirements 1.8, 1.9**

---

### Property 5: Countdown formatter produces valid MM:SS output

*For any* non-negative integer `totalSeconds` in [0, 7200], `formatCountdown(totalSeconds)` SHALL return a string matching `^\d{2}:\d{2}$` where the decoded total seconds equal the input value.

**Validates: Requirements 2.2**

---

### Property 6: Timer initialises to stored Pomodoro duration

*For any* integer duration D in [1, 120] stored in `localStorage` under `pomodoroDuration`, calling `getStoredDuration()` SHALL return D, and the initial `remainingSeconds` set by `initTimer()` SHALL equal D × 60.

**Validates: Requirements 2.3, 2.4**

---

### Property 7: Duration validator accepts valid values and rejects invalid ones

*For any* integer value V:
- If V ∈ [1, 120], `validateDuration(V)` SHALL return V.
- If V < 1 or V > 120 or V is not an integer, `validateDuration(V)` SHALL return null.

**Validates: Requirements 2.5**

---

### Property 8: Reset restores full configured duration

*For any* timer state with a configured `durationMinutes` D, calling `resetTimer()` SHALL set `remainingSeconds` to D × 60 and `formatCountdown(remainingSeconds)` SHALL display the full duration.

**Validates: Requirements 2.9**

---

### Property 9: Task addition round-trip persists to localStorage

*For any* non-empty task text string T, after calling `addTask(T)`, `loadTasks()` SHALL return an array that includes a Task with `text === T`.

**Validates: Requirements 3.2, 3.3, 3.10**

---

### Property 10: Empty or whitespace-only task text is rejected

*For any* string composed entirely of whitespace characters (including the empty string), `isValidTaskText(text)` SHALL return false, and `addTask` SHALL not modify the tasks array.

**Validates: Requirements 3.4**

---

### Property 11: Task completion toggle is self-inverse

*For any* Task with completion status S, calling `toggleTask(id)` twice SHALL result in the task having completion status S (the original value), and both intermediate and final states SHALL be persisted to localStorage.

**Validates: Requirements 3.7, 3.8**

---

### Property 12: Edit task updates text in collection

*For any* existing Task and any non-empty new text string N, after calling `editTask(id, N)`, `loadTasks()` SHALL return an array containing a Task with matching `id` and `text === N`.

**Validates: Requirements 3.6**

---

### Property 13: Delete task removes it from collection

*For any* tasks array containing a Task with id I, after calling `deleteTask(I)`, `loadTasks()` SHALL return an array that does not contain any Task with `id === I`.

**Validates: Requirements 3.9**

---

### Property 14: Quick Link addition round-trip persists to localStorage

*For any* non-empty label string L and URL string U (after normalisation), after calling `addLink(L, U)`, `loadLinks()` SHALL return an array that includes a Link with `label === L`.

**Validates: Requirements 4.2, 4.3, 4.8**

---

### Property 15: Empty label or URL is rejected

*For any* submission where label.trim() is empty OR url.trim() is empty, `isValidLink(label, url)` SHALL return false, and `addLink` SHALL not modify the links array.

**Validates: Requirements 4.4**

---

### Property 16: URL normalisation always produces an absolute URL

*For any* URL string U that does not begin with `"http://"` or `"https://"`, `normaliseUrl(U)` SHALL return `"https://" + U`. For any URL string U that already begins with `"http://"` or `"https://"`, `normaliseUrl(U)` SHALL return U unchanged.

**Validates: Requirements 4.5**

---

### Property 17: Delete Quick Link removes it from collection

*For any* links array containing a Link with id I, after calling `deleteLink(I)`, `loadLinks()` SHALL return an array that does not contain any Link with `id === I`.

**Validates: Requirements 4.7**

---

### Property 18: Theme toggle is self-inverse

*For any* active theme T ∈ {"light", "dark"}, calling `toggleTheme()` twice SHALL result in the same theme T being applied to the document and stored in localStorage.

**Validates: Requirements 5.2**

---

### Property 19: Stored theme is applied on load

*For any* theme value T ∈ {"light", "dark"} stored in `localStorage` under key `"theme"`, calling `applyTheme(getStoredTheme())` SHALL set `document.documentElement.getAttribute("data-theme")` to T.

**Validates: Requirements 5.4**
