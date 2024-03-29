import { apiUsersURL } from "@/URLs"

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

export default getLoggedUserData