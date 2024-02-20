
//assegnazione addEventListener
document.getElementById("logoutbutton").addEventListener("click", logOut)


function logOut() {
    localStorage.clear()
}