/* Slideshows */

var slideboxes = document.getElementsByClassName("slide-box");
for (let i = 0; i < slideboxes.length; i++) {
  updateSlide(slideboxes[i].id, 0);
}

var prevButtons = document.querySelectorAll('.prev');
for (var i = 0; i < prevButtons.length; i++) {
  prevButtons[i].addEventListener('click', function (e) {
    updateSlide(e.target.parentElement.id, -1)
  });
}

/*  original javascript
var nextButtons = document.querySelectorAll('.next');
for (var i = 0; i < nextButtons.length; i++) {
  nextButtons[i].addEventListener('click', function (e) {
    updateSlide(e.target.parentElement.id, 1)
  });
} */

  /* jquery version */
$(".next").on( "click", function() {
  /* $( this ).slideUp(); */
  updateSlide($(this).parent().attr('id'), 1)
} );

function updateSlide(selector, amount) {
  var element = document.getElementById(selector);
  let slides = element.getElementsByClassName("slide-content");
  var currentSlide = parseInt(element.getAttribute("slide"));

  currentSlide = currentSlide + amount;

  if (currentSlide >= slides.length) {
    currentSlide = 0
  } if (currentSlide < 0) {
    currentSlide = slides.length - 1
  }
  /* console.log(selector+" slide = "+currentSlide); */

  element.setAttribute("slide", currentSlide)

  /* for (let i = 0; i < slides.length; i++) {
    if (i == currentSlide) {
      slides[i].style.display = "flex";

    } else {
      slides[i].style.display = "none";
    }
  } */

  $("#" + selector + " .slide-content").each(function (index) {
    if (index == currentSlide) {
      $(this).css('display', 'flex');
    } else {
      $(this).css('display', 'none');
    }
  });
}

/* form validation */

let name = document.getElementById("name")
let contact = document.getElementById("contact")
let message = document.getElementById("message")

let nameError = document.querySelector(".name.error")
let contactError = document.querySelector(".contact.error")
let messageError = document.querySelector(".message.error")
const isEmail = /^\S+@\S+\.\S+$/
const isPhone = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/

name.addEventListener("input", (event) => {
  if (name.value != "") {
    showError("name", "")
  }
});

contact.addEventListener("input", (event) => {
  if (isEmail.test(contact.value) || isPhone.test(contact.value)) {
    showError("contact", "")
  }
});

message.addEventListener("input", (event) => {
  if (message != "") {
    showError("message", "")
  }
});

document.querySelector("form").addEventListener("submit", (event) => {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    $("#success").css('display', 'block');
  }
  event.preventDefault();
});


function validateForm() {
  if (name.value == "") {
    showError("name", "Please enter your name!")
    return false;
  } else {
    showError("name", "")
  }

  if (contact.value == "") {
    showError("contact", "Please enter a phone number or email address!")
    return false;
  } else if (!isEmail.test(contact.value) && !isPhone.test(contact.value)) {
    showError("contact", "This is not a valid phone number or email address!")
    return false;
  } else {
    showError("contact", "")
  }

  if (message.value == "") {
    showError("message", "Please enter a message!")
    return false;
  } else {
    showError("message", "")
  }
  return true
}


function showError(selector, message) {
  /*  console.log(selector + ": " + message); */
  let errorSpan = document.querySelector("." + selector + ".error")
  errorSpan.textContent = message;
  if (message == "") {
    $("." + selector).css('display', 'none');
  } else {
    $("." + selector).css('display', 'block');
  }
}

/* old versions */



/* function validateForm() {
  let x = document.forms["myForm"]["fname"].value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
}
 */


/* if (email.value == "" && phone.value == "") { */
/* if (contact.value == "") {
  alert("Please enter contact information");
  contact.setCustomValidity("Please enter a phone number or email address!");
  return false;
} else if (!isEmail.test(contact.value) && !isPhone.test(contact.value)) {
  contact.setCustomValidity("This is not a valid phone number or email address!");
} */




/* function validateForm() {
    console.log("contact: "+contact.value+", isEmail: "+isEmail.test(contact.value)+", isPhone: "+isPhone.test(contact.value));
  
  if (name.value == "") {
    nameError.textContent  = "Please enter your name!"
    showError("name", "Please enter your name!")
    return false;
  } else {
    showError("name", "")
  }
  if (contact.value == "") {
    contactError.textContent = "Please enter a phone number or email address!"
    showError("contact", "Please enter a phone number or email address!")
    return false;
  } else if (!isEmail.test(contact.value) && !isPhone.test(contact.value)) {
    contactError.textContent = "This is not a valid phone number or email address!"
    showError("contact", "This is not a valid phone number or email address!")
    return false;
  } else {
    showError("contact", "")
  }
  if (message.value == "") {
    messageError.textContent  = "Please enter a message!"
    showError("message", "Please enter a message!")
    return false;
  } else {
    showError("namessageme", "")
  }
  return true
} */