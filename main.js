let events = [];
let archive = [];
const sidebar_btns = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");

function char() {
  const ctx = document.getElementById('myChart');
  if (!ctx || typeof Chart === "undefined") return;

  if (window.myChart && typeof window.myChart.destroy === "function") {
    window.myChart.destroy();
  }

  const labels = events.map(e => e.title);

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Event Prices',
        data: events.map(e => +e.price),
        borderWidth: 2,
        borderColor: 'rgba(158, 172, 172, 1)',
        backgroundColor: '#0c5460',
        tension: 0.2,
        barThickness: 70
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderStats() {

    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);
    
    document.getElementById('stat-total-events').textContent = totalEvents;
    document.getElementById('stat-total-seats').textContent = totalSeats;
    document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
    char();
}


function switchscren(ev) {
  sidebar_btns.forEach(btn => btn.classList.remove("is-active"));
  screens.forEach(screen => {
    if (screen.dataset.screen === ev.dataset.screen) {
      screen.classList.add("is-visible");
      ev.classList.add("is-active");
    } else {
      screen.classList.remove("is-visible");
    }
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById("event-title").value.trim();
  const imageInput = document.getElementById("event-image").value.trim();
  const form = document.getElementById("event-form");
  const eventDescriptionInput = document.getElementById("event-description").value.trim();
  const eventSeatsInput = document.getElementById("event-seats").value.trim();
  const eventPriceInput = document.getElementById("event-price").value.trim();
  const ErrorMsg = document.querySelector("#form-errors");

  const UrlRegexp = /^https?:\/\/.+\.(jpg|jpeg|png|gif|photos|bmp|webp|svg)$/i;
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
    events = JSON.parse(localStorage.getItem("event")) || [];
    const newEvent = {
      title: titleInput.toLowerCase(),
      image: imageInput,
      description: eventDescriptionInput,
      seats: parseInt(eventSeatsInput),
      price: parseFloat(eventPriceInput),
    };
    events.push(newEvent);
    localStorage.setItem("event", JSON.stringify(events));
    form.reset();
  }

  char();
  renderEventsTable();
}

const tbody = document.querySelector(".table__body");

function renderEventsTable() {
  if (!tbody) return;
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
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn-${index}" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
  renderStats();
}
renderEventsTable();

// delete event 
function DeleteEvent(index) {
  events = JSON.parse(localStorage.getItem("event")) || [];
  archive = JSON.parse(localStorage.getItem("archived")) || [];

  if (events[index]) {
    archive.push(events[index]);
    localStorage.setItem("archived", JSON.stringify(archive));
    events.splice(index, 1);
    localStorage.setItem("event", JSON.stringify(events));
  }

  renderEventsTable();
  ArchiveData();
}

function ArchiveData() {
  const archiveTable = document.getElementById("tablebody");
  if (!archiveTable) return;

  archive = JSON.parse(localStorage.getItem("archived")) || [];
  archiveTable.innerHTML = "";
  archive.forEach((item, index) => {
    archiveTable.innerHTML += `
      <tr class="table__row" data-event-id="${index}">
        <td>${index + 1}</td>
        <td>${item.title}</td>
        <td>${item.seats}</td>
        <td>${item.price}$</td>
        <td>
          <button class="btn btn--small" id="Restore-${index}" onclick="RestoreEvent(${index})">Restore</button>
        </td>
      </tr>
    `;
  });
}
ArchiveData();

// Details modal
const modal = document.querySelector("#event-modal");

function ViewDetails(index) {
  events = JSON.parse(localStorage.getItem("event")) || [];
  const modelDetails = document.getElementById("modal-body");
  if (!modal || !modelDetails || !events[index]) return;

  modal.classList.remove("is-hidden");
  modelDetails.innerHTML = `
    <h3>${events[index].title}</h3>
    <p>ID: ${index + 1}</p>
    <p>Image:</p>
    <img src="${events[index].image}" class="image" alt="Event Image"/>
    <p>Seats: ${events[index].seats}</p>
    <p>Price: ${events[index].price}$</p>
    <p>Variants: ${events[index].title}</p>
  `;
}

const closModal = document.querySelector("#close-modal");
if (closModal) {
  closModal.onclick = function () {
    if (modal) modal.classList.add("is-hidden");
  };
}

function RestoreEvent(index) {
  archive = JSON.parse(localStorage.getItem("archived")) || [];
  events = JSON.parse(localStorage.getItem("event")) || [];

  if (archive[index]) {
    events.push(archive[index]);
    archive.splice(index, 1);
    localStorage.setItem("event", JSON.stringify(events));
    localStorage.setItem("archived", JSON.stringify(archive));
  }

  ArchiveData();
  renderEventsTable();
}

function searchData() {
  const searchEvents = document.getElementById("search-events");
  if (!tbody || !searchEvents) return;

  events = JSON.parse(localStorage.getItem("event")) || [];
  const query = searchEvents.value.toLowerCase();
  tbody.innerHTML = "";

  for (let i = 0; i < events.length; i++) {
    if (events[i].title.includes(query)) {
      tbody.innerHTML += `
        <tr class="table__row">
          <td>${i + 1}</td>
          <td>${events[i].title}</td>
          <td>${events[i].seats}</td>
          <td>${events[i].price}</td>
          <td><span class="badge">3</span></td>
          <td>
            <button class="btn btn--small" onclick="ViewDetails(${i})">Details</button>
            <button class="btn btn--small" onclick="EditEvent(${i})">Edit</button>
            <button class="btn btn--danger btn--small" id="deletebtn-${i}" onclick="DeleteEvent(${i})">Delete</button>
          </td>
        </tr>
      `;
    }
  }
}

function sortData(value) {
  // console.log(value)
  events = JSON.parse(localStorage.getItem("event"));
  if (value === "title-asc") {
    sortAZ();
  } else if (value === "title-desc") {
    sortZA();
  } else if (value === "price-asc") {
    priceLoHi();
  } else if (value === "price-desc") {
    priceHiLo();
  } else {
    sortSeats();
  }
}

function sortAZ() {
  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < events.length - i - 1; j++) {
      if (events[j].title.toLowerCase() > events[j + 1].title.toLowerCase()) {
        const temp = events[j];
        events[j] = events[j + 1];
        events[j + 1] = temp;
      }
    }
  }
  tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function sortZA() {
  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < events.length - i - 1; j++) {
      if (events[j].title.toLowerCase() < events[j + 1].title.toLowerCase()) {
        const temp = events[j + 1];
        events[j + 1] = events[j];
        events[j] = temp;
      }
    }
  }
  console.log(events[0].title);
  tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function priceLoHi() {
  for (let i = 0; i < events.length - 1; i++) {
    for (let j = 0; j < events.length - i - 1; j++) {
      if (events[j].price > events[j + 1].price) {
        const temp = events[j];
        events[j] = events[j + 1];
        events[j + 1] = temp;
      }
    }
  }
  tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function priceHiLo() {
  for (let i = 0; i < events.length - 1; i++) {
    for (let j = 0; j < events.length - i - 1; j++) {
      if (events[j].price < events[j + 1].price) {
        const temp = events[j];
        events[j] = events[j + 1];
        events[j + 1] = temp;
      }
    }
  }
  tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function sortSeats() {
  for (let i = 0; i < events.length - 1; i++) {
    for (let j = 0; j < events.length - i - 1; j++) {
      if (events[j].seats > events[j + 1].seats) {
        const temp = events[j];
        events[j] = events[j + 1];
        events[j + 1] = temp;
      }
    }
  }
  tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})" id="editBtn">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}


// Edit Modal
const editModal = document.getElementById("edit-modal");
const closeEditModal = document.getElementById("close-edit-modal");
if (closeEditModal) {
  closeEditModal.addEventListener("click", () => {
    if (editModal) editModal.classList.add("is-hidden");
  });
}
let temp;
const inputs = document.querySelectorAll(".inputs");

function EditEvent(index) {
  events = JSON.parse(localStorage.getItem("event")) || [];
  if (!events[index]) return;

  temp = index;
  if (editModal) editModal.classList.remove("is-hidden");
  inputs[0].value = events[index].title || "";
  inputs[1].value = events[index].image || "";
  inputs[2].value = events[index].description || "";
  inputs[3].value = events[index].seats || "";
  inputs[4].value = events[index].price || "";
}

const editEvent = document.getElementById("edit-event");
if (editEvent) {
  editEvent.addEventListener("click", (e) => {
    e.preventDefault();
    events = JSON.parse(localStorage.getItem("event")) || [];

    if (events[temp]) {
      events[temp].title = inputs[0].value;
      events[temp].image = inputs[1].value;
      events[temp].description = inputs[2].value;
      events[temp].seats = parseInt(inputs[3].value) || 0;
      events[temp].price = parseFloat(inputs[4].value) || 0;

      localStorage.setItem("event", JSON.stringify(events));
      renderEventsTable();
      if (editModal) editModal.classList.add("is-hidden");
    }
  });
}