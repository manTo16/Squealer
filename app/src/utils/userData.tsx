import axios from "@root/axiosConfig"
import { apiUsersURL } from "../URLs"
import { createContext } from "react"


export interface UserDetailsInterface {
    username: string;
    displayName: string;
    email: string;
    creationDate: Date;
    password: string;
    channels: string[];
    ownedChannels: string[];
    dailyChar: number;
    weeklyChar: number;
    monthlyChar: number;
    debtChar: number;
    userImage: string;
    userImage32x32: string;
    impressedPostIds: {
        veryLikes: string[];
        likes: string[];
        dislikes: string[];
        veryDislikes: string[];
        views: string[];
    };
    verified: boolean;
    pro: boolean;
    smm: boolean;
    personalSMM: string;
    smmClients: string[];
    moderator: boolean;
}


export const UserContext = createContext({
    userDetails: JSON.parse(localStorage.getItem('user') ?? 'null') ?? {} as UserDetailsInterface,
    //prende i dati dal server, asincrona. aggiorna anche il valore dei dati utente in locale e lo stato passato tramite contesto
    fetchUserData: async () => {},
    //prende i dati dal localstorage e li mette nello stato passato tramite contesto
    updateUserDataFromLS: () => {}
})

/*
aggiorna l'item 'user' nel local storage
*/
export const getPersonalUserData = async (username: string) => {
    console.log("UserData, username: ", username);
    let response = {data: null};
    if (username) {response = await axios.get(apiUsersURL+'/'+username)}
    console.log("getPersonaUserData checkpoint 1/3")
    const user = response?.data ?? {}
    console.log("getPersonaUserData checkpoint 2/3")
    localStorage.setItem('user',JSON.stringify(user))
    console.log("getPersonaUserData checkpoint 3/3")
    console.log("UserDataResponse: ", response)
    console.log("UserDataUser: ", user)
    return user
}