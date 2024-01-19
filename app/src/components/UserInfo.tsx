import React from 'react'
import ThirdColumn from './ThirdColumn/ThirdColumn'
import Char4LG from './Char indicator/Char4LGscreen'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import WeeklyCalendar from './svg/CharSvg/wCharSvg';
import MonthlyCalendar from './svg/CharSvg/mCharSvg';
import DailyCalendar from './svg/CharSvg/dCharSvg';
import Container from 'react-bootstrap/Container';

function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  //console.log(localStorage.getItem('user'))

  const navigate = useNavigate()

  return (
    <Container className="bg-dark rounded">
      <Row>
        <Button 
          className='btn btn-outline-dark d-flex'
          style={{background: 'transparent'}}
          onClick={() => navigate("/profile")}
        >
          <img src={`${userDetails.userImage}`} alt="user profile picture" width={100} className='py-4 rounded-circle'/>
          <div className='p-3 text-white'>
            <h3>{userDetails.displayName}</h3> 
            <h4>{'@'+userDetails.username}</h4>
          </div>
        </Button>
        
      </Row>
      <Row>
        <Col lg="auto" className='m-2'>
          <Row>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'> <DailyCalendar/> </Col>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'><h5>{userDetails.dailyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'> <WeeklyCalendar/> </Col>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'><h5>{userDetails.weeklyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'> <MonthlyCalendar/> </Col>
            <Col lg="auto" className='d-flex align-text-center justify-content-center'><h5>{userDetails.monthlyChar}</h5></Col>
          </Row>
        </Col>  
        <Col lg={{ span: "auto", offset: 1}}>
          <ThirdColumn />
        </Col>
      </Row>
    </Container>
  )
}

export default UserInfo