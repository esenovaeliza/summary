const API = "http://localhost:8001/contacts";

let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let phone = document.querySelector("#phone");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let editName = document.querySelector("#edit-name");
let editSurname = document.querySelector("#edit-surname");
let editPhone = document.querySelector("#edit-phone");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

let list = document.querySelector("#products-list");

btnAdd.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    surname: surname.value,
    phone: phone.value,
    image: image.value,
  };
  if (
    !obj.name.trim() ||
    !obj.surname.trim() ||
    !obj.phone ||
    !obj.image.trim()
  ) {
    alert("Заполните поля!");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  surname.value = "";
  phone.value = "";
  image.value = "";

  render();
});

async function render() {
  let contacts = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  list.innerHTML = "";
  contacts.forEach((element) => {
    let newELem = document.createElement("div");
    newELem.id = element.id;

    newELem.innerHTML = `<div class="card m-5" style="width: 18rem;">
       <img src=${element.image} class="card-img-top" alt="...">
       <div class="card-body">
         <h5 class="card-title">${element.name}</h5>
         <p class="card-text">${element.surname}</p>
         <p class="card-text"> ${element.phone}</p>
         <a href="#" id=${element.id} onclick = 'deleteContact(${element.id})' class="btn btn-danger btn-delete">DELETE</a>
         <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit">EDIT</a>
       </div>
     </div>`;
    list.append(newELem);
  });
}
render();

function deleteContact(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.name;
        editSurname.value = data.surname;
        editPhone.value = data.phone;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;

  let name = editName.value;
  let surname = editSurname.value;
  let phone = editPhone.value;
  let image = editImage.value;

  if (!name || !surname || !phone || !image) return;

  let editContact = {
    name: name,
    surname: surname,
    phone: phone,
    image: image,
  };
  saveEdit(editContact, id);
});

function saveEdit(editContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editContact),
  }).then(() => {
    render();
  });
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}
