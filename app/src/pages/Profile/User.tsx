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
          <h3>{userDetails.displayName}</h3> 
          <h4>{'@'+userDetails.username}</h4>
          <h5>{userDetails.dailyChar}</h5>
        </Col>
      </Row>
    </Form>
  )
}