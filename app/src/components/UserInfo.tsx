import React, { useContext, useState, useEffect } from 'react'
import ThirdColumn from './ThirdColumn/ThirdColumn'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import WeeklyCalendar from './svg/CharSvg/wCharSvg';
import MonthlyCalendar from './svg/CharSvg/mCharSvg';
import DailyCalendar from './svg/CharSvg/dCharSvg';
import Container from 'react-bootstrap/Container';
import { UserContext } from '@utils/userData';
import Badge from 'react-bootstrap/Badge';
import IconPro from './svg/ProSvg';
import { checkIfInDebt } from "@utils/debt";
import IconVerified from './svg/VerifSvg';

import { UserDetailsInterface } from '@utils/userData';


function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const [userInDebt, setUserInDebt] = useState(false)
  const navigate = useNavigate()
  
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
  
  const fetchDebt = async () => {
    setUserInDebt(await checkIfInDebt(userDetails.username))
  }

  useEffect(() => {
    if (userDetails.username) fetchDebt();
  }, [userDetails.debtChar])  // da cambiare con qualcosa che si aggiorna quando logghi

  return (
    <div className="bg-dark p-2 content-wrapper h-100 rounded-bottom">
      <Row>
        <Col lg={12} xs={0}>
          <Button 
            className='btn w-100 btn-outline-dark m-0 p-0'
            style={{background: 'transparent'}}
            onClick={() => navigate("/profile")}
          >
            <Row>
              <Col>
               <img src={`${userDetails.userImage}`} alt="user profile picture" className='w-100 rounded-circle'/>
              </Col>
            </Row>
            <hr className='text-white' />
            <Row className='text-white'>
              <Col lg={12}>
                <span>
                <h3>{userDetails.displayName}{userDetails.pro && <IconPro/>}{ userDetails.verified && <IconVerified/>}</h3>
                </span>
                
              </Col>
              <Col lg={12}>
                <h4>{'@'+userDetails.username}</h4>
              </Col>
            </Row>
          </Button>
        </Col>
      </Row>
      <hr />
      {
        !!userInDebt ? (
          <div className='d-flex justify-content-center'>
            <Button 
              variant='warning'
              onClick={() => navigate("/charShop")}
            >
              Sei in Debito
            </Button>
          </div>
        ) : (
        <Row>
          <Col lg="auto" className='m-2'>
            <Row>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'> <DailyCalendar/> </Col>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'><h3><Badge pill bg="secondary">{userDetails.dailyChar}</Badge></h3></Col>
            </Row>
            <Row>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'> <WeeklyCalendar/> </Col>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'><h3><Badge pill bg="secondary">{userDetails.weeklyChar}</Badge></h3></Col>
            </Row>
            <Row>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'> <MonthlyCalendar/> </Col>
              <Col lg="auto" className='d-flex align-text-center justify-content-center'><h3><Badge pill bg="secondary">{userDetails.monthlyChar}</Badge></h3></Col>
            </Row>
          </Col>  
        </Row>
      )}
      <hr/>
        <ThirdColumn />
    </div>
  )
}

export default UserInfo