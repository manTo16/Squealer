

import { apiUsersURL, apiAuthURL } from "../urls.mjs"

const getLoggedUserData = async (username) =>{
  try{
    const url=apiUsersURL+'/'+username
    const response = await fetch(url)
    const user = await response.json()
    localStorage.setItem('user',JSON.stringify(user))
  }catch(err){
    console.log("GETerror", err)
  }
}


const handleLogin = async () => {
    try {

        const username = document.getElementById("usernameField").value
        const password = document.getElementById("passwordField").value


      const response = await fetch(apiAuthURL+'/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password, accountType: "mod" }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token
        localStorage.setItem('token', token)
        localStorage.setItem('isUserLoggedIn', 'true')
        await getLoggedUserData(username);
        alert('login successful')
      } else {
        console.error('Login error:', response.statusText);
      }
    } catch (error) {
      console.error('Login request error:', error);
    }
  }


//assegnazione addEventListener
document.getElementById("loginButton").addEventListener("click", () => handleLogin())