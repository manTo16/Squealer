import { Col, Row, Stack } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

export default function Utente (){
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

  return(
    <Form className='bg-dark rounded p-2 m-1'>
      <Row>
        <Col>
          <Button 
            className='btn btn-outline-dark'
            style={{background: 'transparent'}}
            // onClick={() => window.location.reload()}          
          >
            <img src={`${userDetails.userImage}`} alt="user profile picture" width={250} className='rounded-circle'/>
          </Button>
        </Col>
        <Col>
        {/* <div>
          <h4>Nome: {userDetails.displayName}</h4>
          <h4>User: {'@'+userDetails.username}</h4>
          <h4>Dchar: {userDetails.dailyChar}</h4>
        </div> */}
        <div className='pt-3'>
          <Row>
            <Col><h5>Nome:</h5></Col>
            <Col><h5>{userDetails.displayName}</h5></Col>
          </Row>
          <Row>
            <Col><h5>User:</h5></Col>
            <Col><h5>{'@'+userDetails.username}</h5></Col>
          </Row>
          <Row>
            <Col><h5>dChar:</h5></Col>
            <Col><h5>{userDetails.dailyChar}</h5></Col>
          </Row>
          <Row>
            <Col><h5>wChar:</h5></Col>
            <Col><h5>{userDetails.weeklyChar}</h5></Col>
          </Row>
          <Row>
            <Col><h5>mChar:</h5></Col>
            <Col><h5>{userDetails.monthlyChar}</h5></Col>
          </Row>
        </div>
        </Col>
      </Row>
    </Form>
  )
}