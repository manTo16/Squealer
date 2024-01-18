import { Button } from "react-bootstrap";
import { apiUsersURL } from "../URLs";
import axios from "@root/axiosConfig";
import { useEffect, useState } from "react";

import { getPersonalUserData } from "@utils/userData";

export default function CharShopPage() {
    var userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

    const updatePersonalUserData = async () => {

        await getPersonalUserData(userDetails.username)

        userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

        setDisplayDailyChars(userDetails.dailyChar)
        setDisplayWeeklyChars(userDetails.weeklyChar)
        setDisplayMonthlyChars(userDetails.monthlyChar)
        setDisplayDebt(userDetails.debtChar)
    }

    const [displayDailyChars, setDisplayDailyChars] = useState(0)
    const [displayWeeklyChars, setDisplayWeeklyChars] = useState(0)
    const [displayMonthlyChars, setDisplayMonthlyChars] = useState(0)
    const [displayDebt, setDisplayDebt] = useState(0)


    const checkIfInDebt = async (username: string) => {
        const userDebt = await axios.get(apiUsersURL+'/'+username+'/debt').then(response => response.data)

        return (userDebt > 0)
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
        const setDebt = async () => {
            setUserInDebt(await checkIfInDebt(userDetails.username))
        }
        setDebt()
    }, [])

    useEffect(() => {
        updatePersonalUserData();
      }, [userInDebt]);

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
                <Button
                onClick={() => buyChars(10)}>
                    Compra 10 caratteri
                </Button>
            )
        }
        
        </>
    )
}