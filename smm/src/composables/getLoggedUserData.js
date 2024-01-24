const getLoggedUserData = async (username) =>{
  try{
    const url=apiUsersURL+'/'+username
    const response = await axios.get(apiUsersURL+'/'+username)
    const user = response.data
    localStorage.setItem('user',JSON.stringify(user))
  }catch(err){
    console.log("GETerror", err)
  }
}

export default getLoggedUserData