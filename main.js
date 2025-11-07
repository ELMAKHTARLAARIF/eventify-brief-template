let events = [];
let archive = [];
const sidebar_btns = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");


function renderStats() {
  const totalEvents = events.length;
  const totalSeats = events.reduce((sum, e) => +sum + +e.seats, 0);
  const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);
  document.getElementById('stat-total-events').textContent = totalEvents;
  document.getElementById('stat-total-seats').textContent = totalSeats;
  document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}
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
function handleFormSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById("event-title").value.trim();
  const imageInput = document.getElementById("event-image").value.trim();
  const eventDescriptionInput = document.getElementById("event-description").value.trim();
  const eventSeatsInput = document.getElementById("event-seats").value.trim();
  const eventPriceInput = document.getElementById("event-price").value.trim();
  const ErrorMsg = document.querySelector("#form-errors");
  const UrlRegexp = /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  let valid = true;
  ErrorMsg.textContent = "";
  if (!titleInput || !eventDescriptionInput || !eventSeatsInput || !eventPriceInput) {
    ErrorMsg.classList.remove("is-hidden");
    ErrorMsg.textContent = "All fields are required.";
    valid = false;
  }
  if (!UrlRegexp.test(imageInput)) {
    ErrorMsg.classList.remove("is-hidden");
    ErrorMsg.textContent = "Please enter a valid image URL.";
    valid = false;
  }
  if (valid) {
    ErrorMsg.classList.add("is-hidden");
      const events = JSON.parse(localStorage.getItem("event")) || [];
    const newEvent = {
      title: titleInput,
      image: imageInput,
      description: eventDescriptionInput,
      seats: eventSeatsInput,
      price: eventPriceInput
    };
  events.push(newEvent);
  localStorage.setItem("event", JSON.stringify(events));
  }
  renderEventsTable() ;
}
const table = document.getElementById("events-table");
function renderEventsTable() {
  const tbody = document.querySelector(".table__body");
  tbody.innerHTML = "";
  events = JSON.parse(localStorage.getItem("event")) || [];
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id = "deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
    renderStats();
}renderEventsTable();
// delete evenement 
const DeleteBtn = document.querySelectorAll("#deletebtn");
function DeleteEvent(index){
  events.splice(index,1);//hna msse7t event li lblasa dyalo hya index
  localStorage.event=JSON.stringify(events);//hna 3awd 7ttit events f localstorage ba3dma mse7t mnha index event
  renderEventsTable();
}
const edit = document.getElementById("events-pagination")
function EditEvent(edited){

}


