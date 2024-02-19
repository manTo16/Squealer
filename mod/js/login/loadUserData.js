
const loggedUserData = JSON.parse(localStorage.getItem('user'))

document.getElementById("loggedUserUsername").innerText = loggedUserData.username

document.getElementById("loggedUserProfilePicture").setAttribute("src", loggedUserData.userImage)