import axios from "@root/axiosConfig"
import { apiUsersURL } from "../URLs"



export const checkIfInDebt = async (username: string) => {
    const userDebt = await axios.get(apiUsersURL+'/'+username+'/debt').then(response => response?.data ?? 0)

    return (userDebt > 0)
} 