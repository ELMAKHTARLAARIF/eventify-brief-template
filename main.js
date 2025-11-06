let events = [];
let archive = [];
const sidebar_btns = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");

function switchscren(ev) {
  sidebar_btns.forEach(btn => {
    btn.classList.remove("is-active");
  })
  screens.forEach(screen => {
    if (screen.dataset.screen === ev.dataset.screen) {
      screen.classList.add("is-visible");
      ev.classList.add("is-active");
    }
    else {
      screen.classList.remove("is-visible")
    }
  })
}
function renderStats() {
  const totalEvents = events.length;
}

