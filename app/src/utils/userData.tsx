import axios from "@root/axiosConfig"
import { apiUsersURL } from "../URLs"
import { createContext } from "react"




export const UserContext = createContext({
    userDetails: JSON.parse(localStorage.getItem('user') ?? 'null') ?? {},
    //prende i dati dal server, asincrona. aggiorna anche il valore dei dati utente in locale e lo stato passato tramite contesto
    fetchUserData: () => {},
    //prende i dati dal localstorage e li mette nello stato passato tramite contesto
    updateUserDataFromLS: () => {}
})

/*
aggiorna l'item 'user' nel local storage
*/
export const getPersonalUserData = async (username: string) => {
    const response = await axios.get(apiUsersURL+'/'+username)
    console.log("getPersonaUserData checkpoint 1/3")
    const user = response?.data ?? {}
    console.log("getPersonaUserData checkpoint 2/3")
    localStorage.setItem('user',JSON.stringify(user))
    return user
}