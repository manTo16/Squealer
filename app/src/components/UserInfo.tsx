import React, { useContext } from 'react'
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

function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')

  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
  

  const navigate = useNavigate()

  return (
    <Container className="bg-dark p-2 rounded-bottom">
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
                <h3>{userDetails.displayName}</h3> 
              </Col>
              <Col lg={12}>
                <h4>{'@'+userDetails.username}</h4>
              </Col>
            </Row>
          </Button>
        </Col>
      </Row>
      <hr />
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
      <hr/>
        <ThirdColumn />
    </Container>
  )
}

export default UserInfo