import { apiUsersURL } from "@/URLs"

const getUserData = async (username) =>{
  try{
    const url=apiUsersURL+'/'+username
    const response = await fetch(url)
    const user = await response.json()
    localStorage.setItem('selected-vip',JSON.stringify(user))
  }catch(err){
    console.log("GETerror", err)
  }
}

export default getUserData