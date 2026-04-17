const state = {
  day: 12,
  baseUserScore: 215,
  opponentScore: 300,
  currentScreen: "home",
  currentLogTask: "workout",
  avatar: {
    mood: "smile",
    hair: "dark",
  },
  tasks: {
    workout: { label: "W1 | W2+", mode: "workout" },
    diet_compliance: { label: "Nutrition", mode: "check", points: 10 },
    water_gallon: { label: "Water Consumption", mode: "check", points: 5 },
    reading_done: { label: "Read 10 Pages", mode: "check", points: 5 },
    progress_photo: { label: "Progress Pic", mode: "check", points: 5 },
  },
  logs: {
    workout: [
      { name: "Morning run", value: 45, outdoor: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    ],
    diet_compliance: [],
    water_gallon: [],
    reading_done: [],
    progress_photo: [],
  },
  completionHistory: generateCompletionHistory(28),
  apiLog: [],
  navMap: {
    settings: "settings",
    log: "log",
    history: "history",
  },
};

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");
const taskList = document.getElementById("taskList");

const ui = {
  dayBox: document.getElementById("dayBox"),
  userScoreTop: document.getElementById("userScoreTop"),
  opponentScoreTop: document.getElementById("opponentScoreTop"),
  userScoreMatch: document.getElementById("userScoreMatch"),
  opponentScoreMatch: document.getElementById("opponentScoreMatch"),
  userBarTop: document.getElementById("userBarTop"),
  opponentBarTop: document.getElementById("opponentBarTop"),
  statusText: document.getElementById("statusText"),
  historyStreak: document.getElementById("historyStreak"),
  historyTasks: document.getElementById("historyTasks"),
  historyPoints: document.getElementById("historyPoints"),
  historyOpponentPoints: document.getElementById("historyOpponentPoints"),
  historyChart: document.getElementById("historyChart"),
  completionCalendar: document.getElementById("completionCalendar"),
  logTitle: document.getElementById("logTitle"),
  logTypeSelect: document.getElementById("logTypeSelect"),
  logNameInput: document.getElementById("logNameInput"),
  logValueInput: document.getElementById("logValueInput"),
  logOutdoorToggle: document.getElementById("logOutdoorToggle"),
  logFormRoot: document.getElementById("logFormRoot"),
  addLogBtn: document.getElementById("addLogBtn"),
  logEntriesList: document.getElementById("logEntriesList"),
  logTotalValue: document.getElementById("logTotalValue"),
  homeAvatarBtn: document.getElementById("homeAvatarBtn"),
  userAvatarLarge: document.getElementById("userAvatarLarge"),
  profileAvatarPreview: document.getElementById("profileAvatarPreview"),
  calendarSummaryBtn: document.getElementById("calendarSummaryBtn"),
  apiLogList: document.getElementById("apiLogList"),
};

function generateCompletionHistory(days) {
  return Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    completedAll: Math.random() > 0.42,
  }));
}

function pushApi(method, path, payload) {
  const ts = new Date().toISOString();
  state.apiLog.unshift({ ts, method, path, payload });
  state.apiLog = state.apiLog.slice(0, 12);
}

function workoutsCount() {
  return state.logs.workout.length;
}

function outdoorDone() {
  return state.logs.workout.some((w) => w.outdoor);
}

function pointsForTask(taskId) {
  if (taskId === "workout") {
    const w = state.logs.workout;
    const workouts = Math.min(2, w.length);
    const workoutPoints = workouts * 10;
    const outdoorPoints = w.some((x) => x.outdoor) ? 5 : 0;
    return workoutPoints + outdoorPoints;
  }
  const task = state.tasks[taskId];
  if (!task || task.mode !== "check") return 0;
  return state.logs[taskId].length > 0 ? task.points : 0;
}

function getUserScore() {
  const earned = Object.keys(state.tasks).reduce((sum, id) => sum + pointsForTask(id), 0);
  return state.baseUserScore + earned;
}

function getTasksDoneCount() {
  const ids = Object.keys(state.tasks).filter((id) => id !== "workout");
  const doneChecks = ids.filter((id) => state.logs[id].length > 0).length;
  const workoutDone = Math.min(2, workoutsCount());
  return doneChecks + (workoutDone > 0 ? 1 : 0);
}

function showScreen(name) {
  state.currentScreen = name;
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  navButtons.forEach((button) => {
    const target = state.navMap[button.dataset.nav];
    button.classList.toggle("active", target === name);
  });
}

function applyAvatar(element, moodClass) {
  element.innerHTML = `
    <div class="hair"></div>
    <div class="face-eye"></div>
    <div class="face-eye-right"></div>
    <div class="face-mouth"></div>
  `;
  element.classList.remove("smile", "flat");
  element.classList.add(moodClass);
  const hairColor = state.avatar.hair === "dark" ? "rgba(242, 246, 255, 0.85)" : "#c6a56b";
  const bgColor = state.avatar.hair === "dark" ? "rgba(255,255,255,0.02)" : "#1b223a";
  element.style.setProperty("--hair-color", hairColor);
  element.style.setProperty("--avatar-bg", bgColor);
}

function renderAvatarEverywhere() {
  applyAvatar(ui.homeAvatarBtn, state.avatar.mood);
  applyAvatar(ui.userAvatarLarge, state.avatar.mood);
  applyAvatar(ui.profileAvatarPreview, state.avatar.mood);
}

function renderTaskList() {
  taskList.innerHTML = "";

  Object.entries(state.tasks).forEach(([id, task]) => {
    const button = document.createElement("button");
    const done =
      id === "workout" ? state.logs.workout.length > 0 : state.logs[id].length > 0;

    button.className = `task ${done ? "done" : ""}`;
    button.dataset.taskId = id;

    const meta =
      id === "workout"
        ? `${Math.min(2, workoutsCount())} / 2 workouts${outdoorDone() ? " • outdoor ✓" : ""}`
        : done
          ? `${pointsForTask(id)} pts`
          : `${task.points} pts`;

    button.innerHTML = `
      <div class="task-left">
        <div class="task-badge"></div>
        <div>${task.label}</div>
      </div>
      <div class="task-meta">${meta}</div>
    `;

    button.addEventListener("click", () => {
      state.currentLogTask = id;
      renderLogPage();
      showScreen("log");
      ui.statusText.textContent = `${task.label} opened.`;
    });

    taskList.appendChild(button);
  });
}

function renderScoreBar(userScore, opponentScore) {
  const total = Math.max(1, userScore + opponentScore);
  const userPct = (userScore / total) * 100;
  const opponentPct = (opponentScore / total) * 100;
  ui.userBarTop.style.width = `${userPct}%`;
  ui.opponentBarTop.style.width = `${opponentPct}%`;
}

function renderScores() {
  const userScore = getUserScore();
  ui.dayBox.textContent = `DAY ${state.day}`;
  ui.userScoreTop.textContent = `${userScore} pts`;
  ui.opponentScoreTop.textContent = `${state.opponentScore} pts`;
  ui.userScoreMatch.textContent = `${userScore} pts`;
  ui.opponentScoreMatch.textContent = `${state.opponentScore} pts`;
  renderScoreBar(userScore, state.opponentScore);

  ui.historyStreak.textContent = `${state.day} days`;
  ui.historyTasks.textContent = `${getTasksDoneCount()} / ${Object.keys(state.tasks).length}`;
  ui.historyPoints.textContent = `${userScore}`;
  ui.historyOpponentPoints.textContent = `${state.opponentScore}`;

  const bars = ui.historyChart.querySelectorAll("span");
  const values = Object.keys(state.tasks)
    .map((id) => Math.min(90, 20 + pointsForTask(id) * 2))
    .slice(0, bars.length);
  bars.forEach((bar, index) => {
    bar.style.height = `${values[index] || 25}%`;
  });

  const todayCompletedAll = Object.keys(state.tasks)
    .filter((id) => id !== "workout")
    .every((id) => state.logs[id].length > 0);
  ui.calendarSummaryBtn.classList.toggle("checked", todayCompletedAll);
}

function renderLogPage() {
  const currentTask = state.tasks[state.currentLogTask];
  ui.logTitle.textContent = `Create Log — ${currentTask.label}`;

  ui.logTypeSelect.innerHTML = Object.entries(state.tasks)
    .map(
      ([id, task]) =>
        `<option value="${id}" ${id === state.currentLogTask ? "selected" : ""}>${task.label}</option>`
    )
    .join("");

  const isWorkout = state.currentLogTask === "workout";
  ui.logValueInput.style.display = isWorkout ? "block" : "none";
  ui.logOutdoorToggle.closest(".toggle-row").style.display = isWorkout ? "flex" : "none";

  ui.logNameInput.placeholder = isWorkout ? "Workout notes" : "Optional note";
  ui.logValueInput.placeholder = "Duration (mins)";
  ui.logOutdoorToggle.checked = false;
  ui.logNameInput.value = "";
  ui.logValueInput.value = "";

  const entries = state.logs[state.currentLogTask];
  ui.logEntriesList.innerHTML = entries.length
    ? entries
        .map((entry) => {
          if (isWorkout) {
            return `<div class="mock-row"><span>${entry.name || "Workout"}</span><span>${entry.value} min${entry.outdoor ? " • outdoor" : ""}</span></div>`;
          }
          return `<div class="mock-row"><span>${entry.name || "Completed"}</span><span>${pointsForTask(state.currentLogTask)} pts</span></div>`;
        })
        .join("")
    : '<div class="mock-row"><span>No entries yet</span><span>0</span></div>';

  const earnedToday = Object.keys(state.tasks).reduce((sum, id) => sum + pointsForTask(id), 0);
  ui.logTotalValue.textContent = `${earnedToday} / 50`;
}

function renderCalendar() {
  ui.completionCalendar.innerHTML = state.completionHistory
    .map(
      (item) =>
        `<div class="calendar-day ${item.completedAll ? "done" : ""}">${item.day}</div>`
    )
    .join("");
}

function renderApiLog() {
  ui.apiLogList.innerHTML = state.apiLog.length
    ? state.apiLog
        .map((row) => {
          const payload = row.payload ? JSON.stringify(row.payload) : "";
          return `<div class="mock-row"><span>${row.method} ${row.path}</span><span>${payload}</span></div>`;
        })
        .join("")
    : '<div class="mock-row"><span>No simulated calls yet</span><span>—</span></div>';
}

function renderAll() {
  renderAvatarEverywhere();
  renderTaskList();
  renderScores();
  renderLogPage();
  renderCalendar();
  renderApiLog();
}

ui.addLogBtn.addEventListener("click", () => {
  const taskId = ui.logTypeSelect.value;
  const name = ui.logNameInput.value.trim() || "Quick entry";
  const isWorkout = taskId === "workout";

  if (isWorkout) {
    const value = Number(ui.logValueInput.value || 0);
    if (!value) return;
    if (workoutsCount() >= 2) {
      ui.statusText.textContent = "Workout limit reached (2 max per day).";
      return;
    }

    const outdoor = ui.logOutdoorToggle.checked;
    const outdoorAlreadyCounted = outdoorDone();
    state.logs.workout.push({ name, value, outdoor, created_at: new Date().toISOString() });
    pushApi("POST", "/api/workouts/", { duration_mins: value, is_outdoor: outdoor, notes: name });
    ui.logValueInput.value = "";
    ui.logOutdoorToggle.checked = false;
    ui.statusText.textContent = outdoor && !outdoorAlreadyCounted ? "Workout logged (+10) + outdoor bonus (+5)." : "Workout logged (+10).";
  } else {
    // Check tasks are single-completion in MVP; treat the first entry as completion.
    if (state.logs[taskId].length === 0) {
      state.logs[taskId].push({ name, value: 1, created_at: new Date().toISOString() });
      pushApi("POST", "/api/habits/", { task_key: taskId, log_date: new Date().toISOString().slice(0, 10), completed: true });
      ui.statusText.textContent = `${state.tasks[taskId].label} completed.`;
    } else {
      // Toggle off by clearing the log.
      state.logs[taskId] = [];
      pushApi("POST", "/api/habits/", { task_key: taskId, log_date: new Date().toISOString().slice(0, 10), completed: false });
      ui.statusText.textContent = `${state.tasks[taskId].label} unchecked.`;
    }
  }

  state.currentLogTask = taskId;
  ui.logNameInput.value = "";
  renderAll();
});

ui.logTypeSelect.addEventListener("change", (event) => {
  state.currentLogTask = event.target.value;
  renderLogPage();
});

document.querySelectorAll(".page-home-btn").forEach((button) => {
  button.addEventListener("click", () => showScreen("home"));
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(state.navMap[button.dataset.nav]);
  });
});

ui.homeAvatarBtn.addEventListener("click", () => showScreen("profile"));
ui.userAvatarLarge.addEventListener("click", () => showScreen("profile"));
ui.calendarSummaryBtn.addEventListener("click", () => showScreen("history"));

document.querySelectorAll("[data-face]").forEach((button) => {
  button.addEventListener("click", () => {
    state.avatar.mood = button.dataset.face;
    document
      .querySelectorAll("[data-face]")
      .forEach((item) => item.classList.toggle("active", item.dataset.face === state.avatar.mood));
    renderAvatarEverywhere();
  });
});

document.querySelectorAll("[data-hair]").forEach((button) => {
  button.addEventListener("click", () => {
    state.avatar.hair = button.dataset.hair;
    document
      .querySelectorAll("[data-hair]")
      .forEach((item) => item.classList.toggle("active", item.dataset.hair === state.avatar.hair));
    renderAvatarEverywhere();
  });
});

renderAll();
showScreen("home");
