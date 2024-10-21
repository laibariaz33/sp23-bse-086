window.onload = function() {
  let form = document.getElementById("rForm");
  form.onsubmit = handleFormSubmit;
}

function handleFormSubmit(event) {
  
  event.preventDefault();

  let userName = document.getElementById("InputName").value.trim();
  let email = document.getElementById("InputEmail1").value.trim();
  let address = document.getElementById("InputAddress").value.trim();
  let city = document.getElementById("InputCity").value.trim();

  var namePattern = /^[A-Za-z\s]+$/;
  var email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var cityPattern = /^[a-zA-Z\s'-]+$/;

  let isValid = true;
  let name_error = document.getElementById("name_error");
  let email_error = document.getElementById("email_error");
  let address_error = document.getElementById("address_error");
  let city_error = document.getElementById("city_error");

  name_error.innerHTML = "";
  email_error.innerHTML = "";
  address_error.innerHTML = "";
  city_error.innerHTML = "";

  if (userName === "" || userName.length < 2) {
      name_error.innerHTML = "Name is empty or too short.";
      isValid = false;
  } else if (!namePattern.test(userName)) {
      name_error.innerHTML = "Name can only contain letters and spaces.";
      isValid = false;
  }

  if (email === "") {
      email_error.innerHTML = "Email address cannot be empty.";
      isValid = false;
  } else if (!email_pattern.test(email)) {
      email_error.innerHTML = "Please enter a valid email address.";
      isValid = false;
  }

 if (address === "" || address.length < 5) {
      address_error.innerHTML = "Address is empty or too short.";
      isValid = false;
  }

   if (city === "" || city.length < 2) {
      city_error.innerHTML = "City name is empty or too short.";
      isValid = false;
  } else if (!cityPattern.test(city)) {
      city_error.innerHTML = "City name can only contain letters, spaces, hyphens, and apostrophes.";
      isValid = false;
  }

 if (isValid) {
      alert("Form is valid! You can submit the form.");
     
  } else {
      alert("Form contains errors. Please fix them before submitting.");
  }
}
