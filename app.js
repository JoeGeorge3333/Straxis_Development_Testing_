const state = {
  baseScore: 20,
  workoutPoints: 15,
  habitPoints: 15,
};

const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const scoreNode = document.getElementById("dailyScore");
const ringNode = document.getElementById("ringProgress");
const workoutForm = document.getElementById("workoutForm");
const workoutList = document.getElementById("workoutList");
const habitInputs = document.querySelectorAll(".habit-item input");
const joinLeagueButton = document.getElementById("joinLeagueButton");
const joinModal = document.getElementById("joinModal");

function activateTab(target) {
  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tabTarget === target);
  });
}

function renderScore() {
  const score = state.baseScore + state.workoutPoints + state.habitPoints;
  const circumference = 301.59;
  const progress = Math.min(score / 50, 1);
  const offset = circumference - circumference * progress;

  scoreNode.textContent = String(score);
  ringNode.style.strokeDashoffset = String(offset.toFixed(2));
}

function updateHabitPoints() {
  state.habitPoints = Array.from(habitInputs).reduce((total, input) => {
    return total + (input.checked ? Number(input.dataset.points) : 0);
  }, 0);

  renderScore();
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
});

habitInputs.forEach((input) => {
  input.addEventListener("change", updateHabitPoints);
});

workoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const duration = Number(document.getElementById("durationInput").value);
  const notes = document.getElementById("notesInput").value.trim() || "Workout logged";
  const isOutdoor = document.getElementById("outdoorInput").checked;

  const item = document.createElement("article");
  item.className = "workout-item";
  item.innerHTML = `
    <div>
      <strong>${duration} min session</strong>
      <p>${notes}</p>
    </div>
    <span class="badge ${isOutdoor ? "badge-gold" : "badge-outline"}">
      ${isOutdoor ? "OUTDOOR" : "INDOOR"}
    </span>
  `;

  workoutList.prepend(item);
  state.workoutPoints = isOutdoor ? 15 : 10;
  renderScore();
  activateTab("dashboard");
});

joinLeagueButton.addEventListener("click", () => {
  if (typeof joinModal.showModal === "function") {
    joinModal.showModal();
  }
});

joinModal.addEventListener("close", () => {
  if (joinModal.returnValue === "confirm") {
    joinLeagueButton.textContent = "League joined";
  }
});

activateTab("dashboard");
updateHabitPoints();
