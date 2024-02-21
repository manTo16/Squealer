



const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

if (!token || (user && !user.moderator)) {
  window.location.href = "login/"
}