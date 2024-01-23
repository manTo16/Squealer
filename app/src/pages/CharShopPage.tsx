import { Button } from "react-bootstrap";
import { apiUsersURL } from "../URLs";
import axios from "@root/axiosConfig";
import { useContext, useEffect, useState } from "react";

import { UserContext, getPersonalUserData } from "@utils/userData";

export default function CharShopPage() {
    //var userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)


    const updatePersonalUserData = async () => {

        await fetchUserData()

        //userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

    }

    const [displayDailyChars, setDisplayDailyChars] = useState(0)
    const [displayWeeklyChars, setDisplayWeeklyChars] = useState(0)
    const [displayMonthlyChars, setDisplayMonthlyChars] = useState(0)
    const [displayDebt, setDisplayDebt] = useState(0)


    const checkIfInDebt = async (username: string) => {
        const userDebt = await axios.get(apiUsersURL+'/'+username+'/debt').then(response => response?.data ?? 0)

        return (userDebt > 0)
    } 

    const fetchDebt = async () => {
        setUserInDebt(await checkIfInDebt(userDetails.username))
    }

    const buyChars = async (numChars: number) => {
        if (numChars < 0) return

        await axios.patch(apiUsersURL+'/'+userDetails.username+'/characters',
                            {daily: numChars, weekly: numChars, monthly: numChars})

        //aggiorna in locale i caratteri rimasti
        await updatePersonalUserData()
    }

    const [userInDebt, setUserInDebt] = useState(false)

    useEffect(() => {
        fetchDebt()
    }, [])

    useEffect(() => {
        updatePersonalUserData();
    }, [userInDebt]);

    useEffect(() => {
        setDisplayDailyChars(userDetails.dailyChar)
        setDisplayWeeklyChars(userDetails.weeklyChar)
        setDisplayMonthlyChars(userDetails.monthlyChar)
        fetchDebt()
        setDisplayDebt(userDetails.debtChar)
    }, [userDetails])



    return(
        <>
        <h2>I tuoi caratteri (aggiornato live B) ):</h2>
        <p>Quota giornaliera: {displayDailyChars}</p>
        <p>Quota settimanale: {displayWeeklyChars}</p>
        <p>Quota mensile: {displayMonthlyChars}</p>
        <p>Debito: {displayDebt}</p>
        {
            userInDebt ?
            (
                <Button
                    onClick={() => buyChars(userDetails.debtChar)}>Risana debito</Button>
            ) :
            (
                <>
                    <Button
                    onClick={() => buyChars(10)}>
                        Compra 10 caratteri
                    </Button>
                    <Button
                    onClick={() => buyChars(125)}>
                        Compra 125 caratteri per un'immagine
                    </Button>
                </>
            )
        }
        
        </>
    )
}