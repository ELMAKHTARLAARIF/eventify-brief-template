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
  const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
  const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);
  document.getElementById('stat-total-events').textContent = totalEvents;
  document.getElementById('stat-total-seats').textContent = totalSeats;
  document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}

