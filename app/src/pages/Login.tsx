import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ButtonBootstrap from 'react-bootstrap/Button'
import Logo from '../assets/squealer-logo.png'

export default function Login() {
  return (
    <div>
      <Container className='d-flex justify-content-center align-items-center flex-column my-10 container-md'>
        <img className='my-3 mt-10' src={Logo} width={200}/>
        <h1>Log in to Squealer</h1>
        <Form.Label> Username </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Group ></Form.Group>
            <Form.Control placeholder="type username here" aria-label="username"/>
        </Form.Group>
        <Form.Label> Password </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Control placeholder="type password here" aria-label="password"/>
        </Form.Group>
        <ButtonBootstrap type="submit" className='my-3'>Log in</ButtonBootstrap>
      </Container>
    </div>
  )
}
