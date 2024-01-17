import { Col, Row, Stack } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useState } from 'react';
import Feed from '@components/Feed/Feed';

export default function Utente (){
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

  return(
    <Form className='bg-dark rounded p-2 m-1'>
      <Row>
        <Col xs="auto" sm="auto" lg="auto" md="auto">
          <Button 
            className='btn btn-outline-dark'
            style={{background: 'transparent'}}
            // onClick={() => window.location.reload()}          
          >
            <Image src={`${userDetails.userImage}`} alt="user profile picture" width={250} fluid className='rounded-circle'/>
          </Button>
        </Col>
        <Col xs={12} sm={4}>
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
          <Row className='py-4'>
            <Button variant="success">Compra altri caratteri per i tuoi squeal</Button>
          </Row>
        </div>
        </Col>
      </Row>
      <hr/>
      <Feed searchQuery={userDetails.username} searchRoute="search/byUsername"/>
    </Form>
  )
}