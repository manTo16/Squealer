import { Badge, Button, Col, Row } from "react-bootstrap";
import { apiUsersURL } from "../URLs";
import axios from "@root/axiosConfig";
import { useContext, useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Container, Collapse } from "react-bootstrap";
import { UserContext, getPersonalUserData } from "@utils/userData";
import Char from "@components/svg/CharSvg";
import DailyCalendar from "@components/svg/CharSvg/dCharSvg";
import MonthlyCalendar from "@components/svg/CharSvg/mCharSvg";
import WeeklyCalendar from "@components/svg/CharSvg/wCharSvg";

import { checkIfInDebt } from "@utils/debt";
import { useNavigate } from "react-router-dom";

import { UserDetailsInterface } from "@utils/userData";

export default function CharShopPage() {
    //var userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}
    const isLoggedIn = !!localStorage.getItem('token')

    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
    const [isLoading, setIsLoading] = useState(true);
    const [openDebit, setOpenDebit] = useState(false);

    const navigate = useNavigate()

    const updatePersonalUserData = async () => {
        await fetchUserData();
        setIsLoading(false);

        //userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

    }

    const [displayDailyChars, setDisplayDailyChars] = useState(0)
    const [displayWeeklyChars, setDisplayWeeklyChars] = useState(0)
    const [displayMonthlyChars, setDisplayMonthlyChars] = useState(0)

    const [displayDebt, setDisplayDebt] = useState(0)
    const [errorDebt, setErrorDebt] = useState("")

    const [numCharsToAdd, setNumCharsToAdd] = useState(0);



    const handleNumCharsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumCharsToAdd(Number(event.target.value));
    }

    const fetchDebt = async () => {
        setUserInDebt(await checkIfInDebt(userDetails.username))
    }

    const buyChars = async (numChars: number) => {
        setIsLoading(true);
        if (numChars < 0) return
        
        await axios.patch(apiUsersURL+'/'+userDetails.username+'/characters',
                        {daily: numChars, weekly: numChars, monthly: numChars})
        

        //aggiorna in locale i caratteri rimasti
        await updatePersonalUserData()
    }

    const [userInDebt, setUserInDebt] = useState(false)


    useEffect(() => {
        if (isLoggedIn) updatePersonalUserData();
    }, [userInDebt]);

    useEffect(() => {
        if (isLoggedIn) {
            setDisplayDailyChars(userDetails.dailyChar)
            setDisplayWeeklyChars(userDetails.weeklyChar)
            setDisplayMonthlyChars(userDetails.monthlyChar)
            fetchDebt()
            setDisplayDebt(userDetails.debtChar)
        }
    }, [userDetails])

    useEffect(() => {
        if (!isLoggedIn) navigate("/login")
    }, [])

    const handleDebitClick = () => {
        setOpenDebit(!openDebit)
    }
    
    const handleBuyCharsDebt = (numCharsToAdd: number) => {
        if (numCharsToAdd < displayDebt) {
            setErrorDebt("Non hai abbastanza caratteri per saldare il debito");
        } else {
            buyChars(numCharsToAdd)
            setErrorDebt("");
        }
    }

    return(
        <div className="bg-dark rounded-bottom p-3">
            <div className="d-flex flex-row align-items-center">
                <h1>I tuoi caratteri</h1>
                <h1 className="ms-auto"></h1>
            </div>
        <hr />
            <div>
                { userInDebt ? (
                <Container className="gap-3">
                    <Row className="p-3 justify-content-evenly bg-danger rounded">
                        <Col className="d-flex gap-3 align-items-center">
                            <div>⚠</div>
                            <div> Debito: </div>
                            <Badge bg="warning" className="text-black" pill> {displayDebt} </Badge>
                        </Col>
                        <Col> {/* Aggiunto Col per migliorare l'allineamento del Button */}
                            <div className="d-flex justify-content-end"> {/* Justify-content-end allinea il Button a destra */}
                            <Button
                                variant="success"
                                onClick={() => buyChars(displayDebt)}>
                                Risana debito
                            </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                ) : (
                    <>
                        <Row>
                            <Col>
                                <DailyCalendar/>
                            </Col>
                            <Col>
                                <p>Quota giornaliera: </p>
                            </Col>
                            <Col>
                            <Badge bg="secondary" pill> {displayDailyChars} </Badge>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <WeeklyCalendar/>
                            </Col>
                            <Col>
                                <p>Quota settimanale: </p>
                            </Col>
                            <Col>
                            <Badge bg="secondary" pill> {displayWeeklyChars} </Badge>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MonthlyCalendar/>
                            </Col>
                            <Col>
                                <p>Quota mensile: </p>
                            </Col>
                            <Col>
                                <Badge bg="secondary" pill> {displayMonthlyChars} </Badge>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
            <hr />
            {
                isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : userInDebt ?(
                    <div></div>
                ) :
                (
                    <>
                    <div className="d-flex">
                        <div className="ms-auto d-flex flex-column">
                            <input 
                                type="number" 
                                className="mb-2"
                                value={numCharsToAdd} 
                                onChange={handleNumCharsChange} 
                                min="0"
                            />
                            <Button
                                variant="success"
                                onClick={() => buyChars(numCharsToAdd)}>
                                Compra {numCharsToAdd} caratteri
                            </Button>
                            <hr />
                            <Button
                                variant="success"
                                onClick={() => buyChars(125)}>
                                Compra 125 caratteri
                            </Button>
                        </div>
                    </div>
                    {/* <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div> */}
                    </>
                )
            }
        
        </div>
    )
}