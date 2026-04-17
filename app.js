const state = {
  dayNumber: 12,
  youPoints: 215,
  oppPoints: 300,
  tasks: {
    diet_compliance: false,
    water_gallon: false,
    reading_done: false,
    progress_photo: false,
  },
  workouts: {
    w1: false,
    w2: false,
  },
};

const nodeDay = document.getElementById("wfDayNumber");
const nodeYou = document.getElementById("wfYouPoints");
const nodeOpp = document.getElementById("wfOppPoints");
const nodeYou2 = document.getElementById("wfYouPoints2");
const nodeOpp2 = document.getElementById("wfOppPoints2");
const nodeFill = document.getElementById("wfProgressFill");
const calendarButton = document.getElementById("wfCalendarButton");

const taskButtons = Array.from(document.querySelectorAll(".wf-task[data-task]"));
const workoutPills = Array.from(document.querySelectorAll(".wf-pill[data-workout-slot]"));
const navButtons = Array.from(document.querySelectorAll(".wf-nav-btn"));

function computeBonus() {
  let bonus = 0;
  for (const button of taskButtons) {
    const key = button.dataset.task;
    const points = Number(button.dataset.points || 0);
    if (key && state.tasks[key]) bonus += points;
  }
  if (state.workouts.w1) bonus += 10;
  if (state.workouts.w2) bonus += 10;
  return bonus;
}

function render() {
  nodeDay.textContent = String(state.dayNumber);

  const bonus = computeBonus();
  const youTotal = state.youPoints + bonus;

  nodeYou.textContent = String(youTotal);
  nodeOpp.textContent = String(state.oppPoints);
  nodeYou2.textContent = `${youTotal} pts`;
  nodeOpp2.textContent = `${state.oppPoints} pts`;

  const pct = youTotal / Math.max(youTotal + state.oppPoints, 1);
  nodeFill.style.width = `${Math.round(pct * 100)}%`;

  taskButtons.forEach((button) => {
    const key = button.dataset.task;
    button.classList.toggle("is-done", !!(key && state.tasks[key]));
  });

  workoutPills.forEach((pill) => {
    const slot = pill.dataset.workoutSlot;
    const isDone = slot === "1" ? state.workouts.w1 : slot === "2" ? state.workouts.w2 : false;
    pill.classList.toggle("is-done", isDone);
  });
}

function toggleTask(taskKey) {
  state.tasks[taskKey] = !state.tasks[taskKey];
  render();
}

function toggleWorkout(slot) {
  if (slot === "1") state.workouts.w1 = !state.workouts.w1;
  if (slot === "2") state.workouts.w2 = !state.workouts.w2;
  render();
}

taskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const taskKey = button.dataset.task;
    if (!taskKey) return;
    toggleTask(taskKey);
  });
});

workoutPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const slot = pill.dataset.workoutSlot;
    if (!slot) return;
    toggleWorkout(slot);
  });
});

calendarButton?.addEventListener("click", () => {
  // MVP web demo: stubbed
  alert("Calendar is a stub in the web demo. (Next: show a streak calendar modal.)");
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.toggle("is-active", b === button));
  });
});

render();
