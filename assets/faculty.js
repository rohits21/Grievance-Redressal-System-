
const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})


function showHide(elm) {


  if (elm == "Rejected") {
  //display textbox
    document.getElementById('fb_text').style.display = "block";
  } else {
  //hide textbox
    document.getElementById('fb_text').style.display = "none";
  }

}
const statusOfComp = $("#statusOfComp");







var password = document.getElementById("faculty_password")
  , confirm_password = document.getElementById("faculty_confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function toggle(i) {
  const ele = document.getElementsByName(i);
  const btn = ele[0]
  const targetDiv = ele[1]
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
    btn.innerHTML = "View Details"
  } else {
    targetDiv.style.display = "block";
    btn.innerHTML = "Hide Details"
  }
  console.log("button",btn)
};

function ViewHide(){
  const btn = document.getElementsByClassName('toggle')
  const target = document.getElementsByClassName('target')
  //set name attribute according to their index in allComplaints
  for(var i=0;i<btn.length;i++){
    btn[i].setAttribute('name',i)
    target[i].setAttribute('name',i)
  }
}