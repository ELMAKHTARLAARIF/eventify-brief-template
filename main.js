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
       events = JSON.parse(localStorage.getItem("event")) || [];

    const newEvent = {
      title: titleInput.toLowerCase(),
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
 const tbody = document.querySelector(".table__body");
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
          <button class="btn btn--small" onclick="ViewDetails(${index})">Details</button>
          <button class="btn btn--small" onclick="EditEvent(${index})">Edit</button>
          <button class="btn btn--danger btn--small" id = "deletebtn" onclick="DeleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
    renderStats();
}renderEventsTable();
// delete evenement 
function DeleteEvent(index) {
   events = JSON.parse(localStorage.getItem("event")) || [];

  archive.push(events[index]);

  localStorage.setItem("archived", JSON.stringify(archive));

  events.splice(index, 1);
  localStorage.setItem("event", JSON.stringify(events));
  renderEventsTable();
  ArchiveData();
}

function ArchiveData() {
  const archiveTable = document.getElementById("tablebody");

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
          <button class="btn btn--small" id="Restore" onclick="RestoreEvent(${index})">Restore</button>
        </td>
      </tr>
    `;
  });
}ArchiveData();

const edit = document.getElementById("events-pagination")
function EditEvent(edited){

}
const modal = document.querySelector(".modal");
function ViewDetails(index){
  const modelDetails =document.getElementById("modal-body");
  const modalContent = document.getElementById("modal-details")
  console.log(modelDetails)
  console.log(modal)
  modal.classList.remove("is-hidden");
  modelDetails.innerHTML=`
                <h3> ${events[index].title}</h3>
                <p>ID ${index + 1}</p>
                <p>image </p>
                <img src=" ${events[index].image}" class = "image"</img>
                <p> Nombre de seats:${events[index].seats}</p>
                <p> price ${events[index].price}</p>
                <p>variants ${events[index].title}</p>
                
  `
}
const closModal = document.querySelector(".modal__close");
console.log(closModal)
closModal.onclick= function close(){
  modal.classList.add("is-hidden");
};

// function RestoreEvent(index) {
//   const archived = JSON.parse(localStorage.getItem("archived")) || [];
//   const events = JSON.parse(localStorage.getItem("event")) || [];

//   events.push(archived[index]);
//   localStorage.setItem("event", JSON.stringify(events));

//   archived.splice(index, 1);
//   localStorage.setItem("archived", JSON.stringify(archived));

//   ArchiveData();
//   renderEventsTable();
// }
// function searchData(){
//   const searchEvents = document.getElementById("search-events");
//   tbody.innerHTML="";
//   for (let i = 0 ;i<events.length;i++)
//   {
//         if (events[i].title.includes(searchEvents.value.toLowerCase())){
//           tbody.innerHTML += `
//       <tr class="table__row">
//         <td>${i+1}</td>
//         <td>${events[i].title}</td>
//         <td>${events[i].seats}</td>
//         <td>${events[i].price}</td>
//         <td><span class="badge">3</span></td>
//         <td>
//           <button class="btn btn--small" onclick="ViewDetails(${i})">Details</button>
//           <button class="btn btn--small" onclick="EditEvent(${i})">Edit</button>
//           <button class="btn btn--danger btn--small" id = "deletebtn" onclick="DeleteEvent(${i})">Delete</button>
//         </td>
//       </tr>
//     `;
//           }
           
//     }
    
//   }
  // function sortData(){
  //   for(let i = 0; i<events.title.length;i++)
  //   {
  //     for(let j = 0;j<events.title.length + i - 1 ;j++)
  //     {

  //     }
  //   }
  // }
  // localStorage.clear();
