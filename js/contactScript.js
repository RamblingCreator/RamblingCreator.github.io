
let name = document.getElementById("name")
let contact = document.getElementById("contact")
let message = document.getElementById("message")

let nameError = document.querySelector(".name.error")
let contactError = document.querySelector(".contact.error")
let messageError = document.querySelector(".message.error")
const isEmail = /^\S+@\S+\.\S+$/
const isPhone = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/

$("#name").on("input", function () {
  if (this.value != "") {
    showError("name", "");
  }
});

$("#message").on("input", function () {
  if (this.value != "") {
    showError("name", "");
  }
});

$("#contact").on("input", function () {
  if (isEmail.test(this.value) || isPhone.test(this.value)) {
    showError("contact", "")
  }
});

document.querySelector("form").addEventListener("submit", (event) => {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    $("#success").css('display', 'inline-block');
  }
  event.preventDefault();
});


function validateForm() {
  if (name.value == "") {
    showError("name", "Please enter your name!");
    return false;
  } else {
    showError("name", "");
  }

  if (contact.value == "") {
    showError("contact", "Please enter a phone number or email address!");
    return false;
  } else if (!isEmail.test(contact.value) && !isPhone.test(contact.value)) {
    showError("contact", "This is not a valid phone number or email address!");
    return false;
  } else {
    showError("contact", "");
  }

  if (message.value == "") {
    showError("message", "Please enter a message!");
    return false;
  } else {
    showError("message", "");
  }
  return true;
}


function showError(selector, message) {
  /*  console.log(selector + ": " + message); */
  /* let errorSpan = document.querySelector("." + selector + ".error")
  errorSpan.textContent = message; */

  $("." + selector + ".popup").text(message);

  if (message == "") {
    $("." + selector).css('display', 'none');
  } else {
    $("." + selector).css('display', 'inline');
  }
}