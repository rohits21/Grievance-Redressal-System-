

const switchers = [...document.querySelectorAll(".switcher")];

switchers.forEach((item) => {
  item.addEventListener("click", function () {
    switchers.forEach((item) =>
      item.parentElement.classList.remove("is-active")
    );
    this.parentElement.classList.add("is-active");
  });
});

var flag = false;
$("#br").prop("disabled", true);

$(document).click(function () {
  if ($("#bTech").prop("checked")) $("#br").prop("disabled", false);
  else {
    $("#br").prop("disabled", true);
  }
});

var password = document.getElementById("student_password"),
  confirm_password = document.getElementById("student_confirm_password");

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;


var adpassword = document.getElementById("password"),
  adconfirm_password = document.getElementById("confpassword");

function advalidatePassword() {
  if (adpassword.value != adconfirm_password.value) {
    adconfirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    adconfirm_password.setCustomValidity("");
  }
}

adpassword.onchange = advalidatePassword;
adconfirm_password.onkeyup = advalidatePassword;

// var mailotp

// function verifyotp(){
// 	userotp = document.getElementById("otp").value
// 	if(mailotp==userotp) {
// 		document.getElementById("checkbtn").innerHTML = "Verified"
// 		document.getElementById("subtn").disabled = false;

// 	}
// 	else 
// 		alert("wrong otp")
// }

// function verifymail() {
//   //send otp to this mail
//   const mail = document.getElementById("email").value;
//   if (sendOtp(mail)) {
//     alert("otp has been sent");
//     document.querySelector(".otp").innerHTML =
//       "<input type='text' placeholder='Enter OTP' id='otp' required />" + 
// 	  "<button type='button'  class='btn btn-primary' id='checkbtn' onclick='verifyotp()'>Check</button>";
//   } else {
//     alert("something went wrong could not send the otp");
//   }
// }
