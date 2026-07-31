// js/app.js — Personal Dashboard
// All widget modules are defined here and initialised on DOMContentLoaded.
// Placeholder: implementation added in subsequent tasks.

(function () {
  'use strict';

  // ------------------------------------------------------------------ //
  //  Theme Manager                                                       //
  // ------------------------------------------------------------------ //

  function getStoredTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Update toggle button icon: 🌙 means currently light (click to go dark),
    // ☀️ means currently dark (click to go light)
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  function initTheme() {
    applyTheme(getStoredTheme());
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  // ------------------------------------------------------------------ //
  //  Greeting Widget                                                     //
  // ------------------------------------------------------------------ //

  var DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  // Returns "HH:MM" from a Date object (zero-padded)
  function formatTime(date) {
    var hh = String(date.getHours()).padStart(2, '0');
    var mm = String(date.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
  }

  // Returns e.g. "Monday, 27 July 2026" from a Date object
  function formatDate(date) {
    var dayName   = DAY_NAMES[date.getDay()];
    var dd        = String(date.getDate()).padStart(2, '0');
    var monthName = MONTH_NAMES[date.getMonth()];
    var yyyy      = date.getFullYear();
    return dayName + ', ' + dd + ' ' + monthName + ' ' + yyyy;
  }

  // Returns the appropriate greeting phrase for the given hour (0-23)
  function getGreetingPhrase(hour) {
    if (hour >= 5  && hour <= 11) { return 'Good Morning'; }
    if (hour >= 12 && hour <= 17) { return 'Good Afternoon'; }
    if (hour >= 18 && hour <= 20) { return 'Good Evening'; }
    return 'Good Night'; // 0-4 and 21-23
  }

  // Combines greeting phrase + optional name
  // Returns "phrase, name" when name is non-empty after trim; else just "phrase"
  function buildGreetingText(phrase, name) {
    var trimmed = (name || '').trim();
    return trimmed ? phrase + ', ' + trimmed : phrase;
  }

  function tickGreeting() {
    var now    = new Date();
    var phrase = getGreetingPhrase(now.getHours());
    var name   = localStorage.getItem('userName') || '';

    var timeEl = document.getElementById('greeting-time');
    var textEl = document.getElementById('greeting-text');
    if (timeEl) { timeEl.textContent = formatTime(now); }
    if (textEl) { textEl.textContent = buildGreetingText(phrase, name); }
  }

  function initGreeting() {
    var now    = new Date();
    var phrase = getGreetingPhrase(now.getHours());
    var name   = localStorage.getItem('userName') || '';

    var timeEl  = document.getElementById('greeting-time');
    var dateEl  = document.getElementById('greeting-date');
    var textEl  = document.getElementById('greeting-text');
    var inputEl = document.getElementById('greeting-name-input');

    if (timeEl)  { timeEl.textContent  = formatTime(now); }
    if (dateEl)  { dateEl.textContent  = formatDate(now); }
    if (textEl)  { textEl.textContent  = buildGreetingText(phrase, name); }
    if (inputEl && name) { inputEl.value = name; }

    var form = document.getElementById('greeting-name-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var newName = inputEl ? inputEl.value.trim() : '';
        localStorage.setItem('userName', newName);
        var p = getGreetingPhrase(new Date().getHours());
        if (textEl) { textEl.textContent = buildGreetingText(p, newName); }
        if (inputEl) { inputEl.value = ''; }
      });
    }

    tickGreeting();
    setInterval(tickGreeting, 60000);
  }

  // ------------------------------------------------------------------ //
  //  Focus Timer                                                         //
  // ------------------------------------------------------------------ //

  // Returns "MM:SS" from a total-seconds integer (e.g. 1500 → "25:00", 90 → "01:30")
  function formatCountdown(totalSeconds) {
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  // Returns the integer value if it is an integer in [1, 120]; otherwise null
  function validateDuration(value) {
    if (!Number.isInteger(value)) { return null; }
    if (value < 1 || value > 120) { return null; }
    return value;
  }

  // (Implementation: Task 4 — timer state machine: initTimer, startTimer, stopTimer, resetTimer, tickTimer, saveDuration, getStoredDuration)

  // ------------------------------------------------------------------ //
  //  To-Do List                                                          //
  // ------------------------------------------------------------------ //

  // Internal task store
  var tasks = [];

  // Loads tasks array from localStorage; returns [] on parse error
  function loadTasks() {
    try {
      var raw = localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // Persists tasks array to localStorage; shows inline error on QuotaExceededError
  function saveTasks(taskList) {
    try {
      localStorage.setItem('tasks', JSON.stringify(taskList));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        var msg = document.getElementById('todo-validation-msg');
        if (msg) { msg.textContent = 'Storage is full. Could not save tasks.'; }
      }
    }
  }

  // Returns false if text is empty after trimming
  function isValidTaskText(text) {
    return (text || '').trim() !== '';
  }

  // (Implementation: Task 5 — addTask, toggleTask, editTask, deleteTask, renderTasks, initTodo)

  // ------------------------------------------------------------------ //
  //  Quick Links                                                         //
  // ------------------------------------------------------------------ //

  // Internal links store
  var links = [];

  // Loads links array from localStorage; returns [] on parse error
  function loadLinks() {
    try {
      var raw = localStorage.getItem('links');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // Persists links array to localStorage; shows inline error on QuotaExceededError
  function saveLinks(linkList) {
    try {
      localStorage.setItem('links', JSON.stringify(linkList));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        var msg = document.getElementById('links-validation-msg');
        if (msg) { msg.textContent = 'Storage is full. Could not save links.'; }
      }
    }
  }

  // Returns false if label or url is empty after trimming
  function isValidLink(label, url) {
    return (label || '').trim() !== '' && (url || '').trim() !== '';
  }

  // Prepends "https://" if url doesn't already start with http:// or https://
  function normaliseUrl(url) {
    var s = (url || '').trim();
    if (s.startsWith('http://') || s.startsWith('https://')) {
      return s;
    }
    return 'https://' + s;
  }

  // (Implementation: Task 6 — addLink, deleteLink, renderLinks, initLinks)

  // ------------------------------------------------------------------ //
  //  Bootstrap                                                           //
  // ------------------------------------------------------------------ //

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initGreeting();
    // Each remaining init function will be called here once implemented.
  });

}());
