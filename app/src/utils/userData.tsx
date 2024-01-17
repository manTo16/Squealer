import axios from "@root/axiosConfig"
import { apiUsersURL } from "../URLs"



export const getPersonalUserData = async (username: string) => {
    const response = await axios.get(apiUsersURL+'/'+username)
    const user = response.data
    localStorage.setItem('user',JSON.stringify(user))
}