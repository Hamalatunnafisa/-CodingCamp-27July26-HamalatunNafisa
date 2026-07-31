# Requirements Document

## Introduction

Personal Dashboard is a single-page, client-side productivity web application built with HTML, CSS, and Vanilla JavaScript. It provides four core widgets — a contextual Greeting, a configurable Pomodoro Focus Timer, a To-Do List, and a Quick Links panel — all persisted in Browser Local Storage. The app supports a manual light/dark mode toggle and is deployed as a static site on GitHub Pages.

---

## Glossary

- **Dashboard**: The single HTML page that hosts all widgets.
- **Greeting Widget**: The full-width hero section at the top of the Dashboard that displays the current time, date, and a personalised greeting message.
- **Focus Timer**: The Pomodoro-style countdown timer widget with configurable work duration.
- **To-Do List**: The task management widget that allows users to add, edit, complete, and delete tasks.
- **Quick Links**: The widget that renders user-defined favourite website shortcuts as clickable buttons.
- **Local Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Theme**: The visual colour scheme of the Dashboard, either Light or Dark.
- **User Name**: The custom name entered by the user, stored in Local Storage, and displayed in the Greeting Widget.
- **Pomodoro Duration**: The user-configurable length (in minutes) of a single Focus Timer work session, stored in Local Storage.
- **Task**: A single to-do item with a text description and a completion status.
- **Quick Link**: A record containing a display label and a URL, stored in Local Storage and rendered as a button.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a user, I want to see a personalised greeting with the current time and date, so that I have immediate contextual awareness when I open the Dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Greeting Widget as a full-width hero section at the top of the page.
2. WHEN the Dashboard page loads, THE Greeting Widget SHALL display the current local time in HH:MM format.
3. WHEN the Dashboard page loads, THE Greeting Widget SHALL display the current local date in a human-readable format (e.g., Monday, 27 July 2026).
4. WHEN the current local time is between 05:00 and 11:59, THE Greeting Widget SHALL display the greeting text "Good Morning".
5. WHEN the current local time is between 12:00 and 17:59, THE Greeting Widget SHALL display the greeting text "Good Afternoon".
6. WHEN the current local time is between 18:00 and 20:59, THE Greeting Widget SHALL display the greeting text "Good Evening".
7. WHEN the current local time is between 21:00 and 04:59, THE Greeting Widget SHALL display the greeting text "Good Night".
8. WHEN a User Name is stored in Local Storage, THE Greeting Widget SHALL append the User Name to the greeting text (e.g., "Good Morning, Nafisa").
9. WHEN no User Name is stored in Local Storage, THE Greeting Widget SHALL display the greeting text without a name suffix.
10. WHEN the user submits a new User Name via the name input field, THE Dashboard SHALL store the User Name in Local Storage and THE Greeting Widget SHALL update the displayed greeting immediately without a page reload.
11. THE Greeting Widget SHALL update the displayed time once every 60 seconds without requiring a page reload.

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a configurable Pomodoro focus timer with Start, Stop, and Reset controls, so that I can manage focused work sessions according to my own preferred duration.

#### Acceptance Criteria

1. THE Dashboard SHALL display the Focus Timer widget in the first column of the three-column grid on desktop layouts.
2. THE Focus Timer SHALL display a countdown in MM:SS format.
3. WHEN the Dashboard page loads and no Pomodoro Duration is stored in Local Storage, THE Focus Timer SHALL default the session duration to 25 minutes.
4. WHEN a Pomodoro Duration is stored in Local Storage, THE Focus Timer SHALL initialise the countdown to the stored Pomodoro Duration on page load.
5. THE Focus Timer SHALL provide a duration input field that accepts integer values between 1 and 120 (minutes, inclusive).
6. WHEN the user changes the value in the duration input field, THE Focus Timer SHALL store the new Pomodoro Duration in Local Storage.
7. WHEN the user activates the Start button and the timer is not already running, THE Focus Timer SHALL begin counting down from the current session duration.
8. WHEN the user activates the Stop button and the timer is running, THE Focus Timer SHALL pause the countdown and retain the remaining time.
9. WHEN the user activates the Reset button, THE Focus Timer SHALL stop any active countdown and restore the display to the full configured Pomodoro Duration.
10. WHEN the countdown reaches 00:00, THE Focus Timer SHALL stop automatically and THE Dashboard SHALL emit a browser notification or audible alert to signal session completion.
11. WHILE the Focus Timer is running, THE Focus Timer SHALL disable the duration input field to prevent mid-session changes.
12. WHILE the Focus Timer is running, THE Focus Timer SHALL update the countdown display once per second.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a personal task list that persists across browser sessions, so that I can track what I need to accomplish each day.

#### Acceptance Criteria

1. THE Dashboard SHALL display the To-Do List widget in the second column of the three-column grid on desktop layouts.
2. THE Dashboard SHALL load all Tasks from Local Storage and render them in the To-Do List on page load.
3. WHEN the user submits a new task via the task input field, THE To-Do List SHALL add the Task to the list, save the updated task collection to Local Storage, and clear the input field.
4. IF the user submits an empty task input field, THEN THE To-Do List SHALL reject the submission and display an inline validation message.
5. WHEN the user activates the edit control for a Task, THE To-Do List SHALL render the task text in an editable field and provide a confirm control.
6. WHEN the user confirms an edited Task, THE To-Do List SHALL update the Task text in the list and save the updated task collection to Local Storage.
7. WHEN the user activates the complete toggle for a Task, THE To-Do List SHALL toggle the Task's completion status and save the updated task collection to Local Storage.
8. WHEN a Task is marked as complete, THE To-Do List SHALL apply a visual distinction (e.g., strikethrough text) to differentiate it from incomplete Tasks.
9. WHEN the user activates the delete control for a Task, THE To-Do List SHALL remove the Task from the list and save the updated task collection to Local Storage.
10. THE To-Do List SHALL persist all Tasks across page reloads using Local Storage.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access my favourite website shortcuts from the Dashboard, so that I can navigate to frequently visited sites with a single click.

#### Acceptance Criteria

1. THE Dashboard SHALL display the Quick Links widget in the third column of the three-column grid on desktop layouts.
2. THE Dashboard SHALL load all Quick Links from Local Storage and render each as a clickable button on page load.
3. WHEN the user submits a new Quick Link via the add-link form (label + URL), THE Quick Links widget SHALL add the Quick Link to the list and save the updated Quick Links collection to Local Storage.
4. IF the user submits the add-link form with an empty label or empty URL, THEN THE Quick Links widget SHALL reject the submission and display an inline validation message.
5. IF the user submits the add-link form with a URL that does not begin with "http://" or "https://", THEN THE Quick Links widget SHALL prepend "https://" to the URL before saving.
6. WHEN the user activates a Quick Link button, THE Dashboard SHALL open the associated URL in a new browser tab.
7. WHEN the user activates the delete control for a Quick Link, THE Quick Links widget SHALL remove the Quick Link from the list and save the updated Quick Links collection to Local Storage.
8. THE Quick Links widget SHALL persist all Quick Links across page reloads using Local Storage.

---

### Requirement 5: Light / Dark Mode Toggle

**User Story:** As a user, I want to manually switch between a light and dark colour theme, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL display a visible theme toggle control accessible from any scroll position.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL switch the active Theme between Light and Dark.
3. WHEN the Theme is changed, THE Dashboard SHALL store the selected Theme value in Local Storage.
4. WHEN the Dashboard page loads and a Theme value is stored in Local Storage, THE Dashboard SHALL apply the stored Theme immediately before rendering visible content to prevent a flash of the wrong theme.
5. WHEN the Dashboard page loads and no Theme value is stored in Local Storage, THE Dashboard SHALL default to the Light Theme.

---

### Requirement 6: Responsive Layout

**User Story:** As a user, I want the Dashboard to be usable on both desktop and mobile devices, so that I can access it from any screen size.

#### Acceptance Criteria

1. WHEN the viewport width is 768 pixels or greater, THE Dashboard SHALL arrange the Focus Timer, To-Do List, and Quick Links widgets in a three-column grid below the Greeting Widget.
2. WHEN the viewport width is less than 768 pixels, THE Dashboard SHALL stack all widgets in a single column in the following order: Greeting Widget, Focus Timer, To-Do List, Quick Links.
3. THE Dashboard SHALL be styled using a single CSS file located at `css/styles.css`.
4. THE Dashboard SHALL use a single JavaScript file located at `js/app.js` for all interactive behaviour.
5. THE Dashboard SHALL render correctly in the latest stable versions of Chrome, Firefox, Edge, and Safari without polyfills.

---

### Requirement 7: Performance and Usability

**User Story:** As a user, I want the Dashboard to load quickly and respond to interactions without noticeable lag, so that it does not interrupt my workflow.

#### Acceptance Criteria

1. THE Dashboard SHALL complete initial rendering in under 2 seconds on a standard broadband connection.
2. WHEN the user interacts with any widget control, THE Dashboard SHALL reflect the resulting UI change within 100 milliseconds.
3. THE Dashboard SHALL not depend on any external JavaScript libraries, CSS frameworks, or backend server.
4. THE Dashboard SHALL display clear visual hierarchy through consistent use of font sizes, spacing, and colour contrast compliant with WCAG 2.1 AA contrast ratio standards.
5. THE Dashboard SHALL use readable body text with a minimum font size of 14 pixels.
