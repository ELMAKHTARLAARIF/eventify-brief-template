let events = [];
let archive = [];

function char() {
  const ctx = document.getElementById('myChart');

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

const sidebar_btns = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");
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

const varianteClose = document.getElementById("variants-list");
const addVarianteBtn = document.getElementById("btn-add-variant");

addVarianteBtn.addEventListener("click", () => {
  varianteClose.classList.remove("variants__list");

  varianteClose.insertAdjacentHTML("beforeend", `
    <div class="variant-row">
      <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
      <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
      <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
      <select class="select variant-row__type">
        <option value="fixed">Fixed Price</option>
        <option value="percentage">Percentage Off</option>
      </select>
      <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
    </div>
  `);

  const newRow = varianteClose.lastElementChild;
  const removeBtn = newRow.querySelector(".variant-row__remove");
  removeBtn.addEventListener("click", () => {
    newRow.remove();
  });
});
const ErrorMsg = document.querySelector("#form-errors");
function addVariante() {
  let variantRowName = varianteClose.querySelectorAll(".variant-row__name");
  let variantRowqty = varianteClose.querySelectorAll(".variant-row__qty");
  let variantRowvalue = varianteClose.querySelectorAll(".variant-row__value");
  let variantRowType = varianteClose.querySelectorAll(".variant-row__type");
 let variants = [];
 if(variantRowName&&variantRowqty&&variantRowvalue)
 {
  for (let i = 0; i < variantRowName.length; i++) {
    variants.push({
      name: variantRowName[i].value,
      qty: parseInt(variantRowqty[i].value),
      value: parseFloat(variantRowvalue[i].value),
      type: variantRowType[i].value
    });
  }
  
  }
  else{
    ErrorMsg.classList.remove("is-hidden");
    ErrorMsg.textContent = "All fields are required.";
  }
  return variants;
}
let Id =JSON.parse((localStorage.getItem("keyId"))) || 1;

function handleFormSubmit(e) {
  
  e.preventDefault();
  const titleInput = document.getElementById("event-title").value.trim();
  const imageInput = document.getElementById("event-image").value.trim();
  const form = document.getElementById("event-form");
  const eventDescriptionInput = document.getElementById("event-description").value.trim();
  const eventSeatsInput = document.getElementById("event-seats").value.trim();
  const eventPriceInput = document.getElementById("event-price").value.trim();
  

  const UrlRegexp = /^https?:\/\/.+\.(jpg|jpeg|png|gif|photos|bmp|webp|svg)$/i;
  let valid = true;

  ErrorMsg.textContent = "";

  if (!titleInput || !eventDescriptionInput || !eventSeatsInput || !eventPriceInput) {
    ErrorMsg.classList.remove("is-hidden");
    ErrorMsg.textContent = "All fields are required.";
    valid = false;
  }

  // if (!UrlRegexp.test(imageInput)) {
  //   ErrorMsg.classList.remove("is-hidden");
  //   ErrorMsg.textContent = "Please enter a valid image URL.";
  //   valid = false;
  // }

  if (valid) {
    ErrorMsg.classList.add("is-hidden");
    events = JSON.parse(localStorage.getItem("event")) || [] ;

    const newEvent = {
      id:Id,
      title: titleInput.toLowerCase(),
      image: imageInput,
      description: eventDescriptionInput,
      seats: parseInt(eventSeatsInput),
      price: parseFloat(eventPriceInput),
      variants: addVariante()
    }; 
    events.push(newEvent);
    localStorage.setItem("event", JSON.stringify(events));
    Id++;
    localStorage.setItem("keyId", JSON.stringify(Id))
    // form.reset();
  }
  //ila maderthach hna maghadich tjib data dyal variants
  varianteClose.innerHTML="";
  char();
  renderEventsTable();
}

const tbody = document.querySelector(".table__body");

function renderEventsTable() {
  tbody.innerHTML = "";
  events = JSON.parse(localStorage.getItem("event"))|| [];
  events.forEach((event, index) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr class="table__row">
        <td>${event.id}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">${(event.variants||[]).length}</span></td>
        <td>
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn-${index}" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `);
  });
  renderStats();
}
renderEventsTable();

function ViewDetails(index) {
  const events = JSON.parse(localStorage.getItem("event")) ;
const modalDetails = document.getElementById("modal-body");
  modal.classList.remove("is-hidden");

  modalDetails.innerHTML = `
    <h3>${events[index].title}</h3>
    <p>ID: ${events[index].id}</p>
    <p>Image:</p>
    <img src="${events[index].image}" class="image" alt="Event Image"/>
    <p>Seats: ${events[index].seats}</p>
    <p>Price: ${events[index].price }$</p>
    <div class="variantsDetails">
    <h2> Nombre Variants(${events[index].variants.length})</h2>
      ${events[index].variants.map(
          (v, i) => `
            <div class="variant">       
              <h4>Variant ${i+1}: ${v.name}</h4>
              <p>Quantity: ${v.qty}</p>
              <p>Value: ${v.value}</p>
              <p>Type: ${v.type}</p>
            </div>
          `
        )
        .join("")}

    </div>
  `;
}

// delete event 
function DeleteEvent(index) {
  events = JSON.parse(localStorage.getItem("event")) || [];
  archive = JSON.parse(localStorage.getItem("archived")) ||[];

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

  archive = JSON.parse(localStorage.getItem("archived")) ||[];
  archiveTable.innerHTML = "";
  archive.forEach((item, index) => {
    archiveTable.insertAdjacentHTML("beforeend",  `
      <tr class="table__row" data-event-id="${index}">
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.seats}</td>
        <td>${item.price}$</td>
        <td>
          <button class="btn btn--small" id="Restore-${index}" onclick="RestoreEvent(${index})">Restore</button>
        </td>
      </tr>
    `);
  });
}
ArchiveData();

// Details modal
const modal = document.querySelector("#event-modal");


const closModal = document.querySelector("#close-modal");
if (closModal) {
  closModal.onclick = function () {
    if (modal) modal.classList.add("is-hidden");
  };
}

function RestoreEvent(index) {
  archive = JSON.parse(localStorage.getItem("archived")) ;
  events = JSON.parse(localStorage.getItem("event")) ;
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
            <button class="btn btn--small" >Details</button>
            <button class="btn btn--small"  id="editBtn">Edit</button>
            <button class="btn btn--danger btn--small" id="deletebtn">Delete</button>
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
function AfficheNewSortData(){
    tbody.innerHTML = "";
  console.log(tbody);
  events.forEach((event, index) => {
    tbody.innerHTML+= `
      <tr class="table__row">
        <td>${event.id}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>${event.price}</td>
        <td><span class="badge">3</span></td>
        <td>
          <button class="btn btn--small">Details</button>
          <button class="btn btn--small"id="editBtn">Edit</button>
          <button class="btn btn--danger btn--small" id="deletebtn">Delete</button>
        </td>
      </tr>
    `;
  });
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
AfficheNewSortData();
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
AfficheNewSortData();
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
AfficheNewSortData();
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
AfficheNewSortData();
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
AfficheNewSortData();
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
  events = JSON.parse(localStorage.getItem("event"));

  temp = index;
  editModal.classList.remove("is-hidden");
  inputs[0].value = events[index].title ;
  inputs[1].value = events[index].image;
  inputs[2].value = events[index].description ;
  inputs[3].value = events[index].seats ;
  inputs[4].value = events[index].price ;
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
// localStorage.clear();