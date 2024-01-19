import axios from "@root/axiosConfig"
import { apiUsersURL } from "../URLs"
import { createContext } from "react"




export const UserContext = createContext({
    userDetails: JSON.parse(localStorage.getItem('user') ?? 'null') ?? {},
    updateUserData: () => {}
})

/*
aggiorna l'item 'user' nel local storage
*/
export const getPersonalUserData = async (username: string) => {
    console.log("aggiornando oggetto user in locale")
    const response = await axios.get(apiUsersURL+'/'+username)
    console.log("getPersonaUserData checkpoint 1/3")
    const user = response.data
    console.log("getPersonaUserData checkpoint 2/3")
    localStorage.setItem('user',JSON.stringify(user))
    console.log("getPersonaUserData checkpoint 3/3")
    console.log("user: ", user)
    return user
}




/*
userDetail: {
        username: "",
        displayName: "",
        email: "",
        creationDate: new Date(),
        channels: [],
        dailyChar: 0,
        weeklyChar: 0,
        monthlyChar: 0,
        debtChar: 0,
        userImage: "",
        impressedPostIds: {
          veryLikes: [],
          likes: [],
          dislikes: [],
          veryDislikes: [],
          views: []
        },
        verified: false,
        pro: false,
        smm: false,
        personalSMM: "",
        smmClients: [],
        moderator: false
      },
*/