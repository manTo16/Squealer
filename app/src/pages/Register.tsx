import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ButtonBootstrap from 'react-bootstrap/Button'
import Logo from '../assets/squealer-logo.png'

export default function () {
  const [users,setUsers]=useState([])
  const [email,setEmail]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  
  
  return (
    <div>
        
      <Container className='d-flex justify-content-center align-items-center flex-column my-10 container-md'>
        <img className='my-3 mt-10' src={Logo} width={200}/>
        <h1>Sign up to Squealer</h1>
        <Form.Label> Create username </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Group ></Form.Group>
            <Form.Control placeholder="type username here" aria-label="username"/>
        </Form.Group>
        <Form.Label> Your email </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Control placeholder="type email here" aria-label="email"/>
        </Form.Group>
        <Form.Label> Create password </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Control placeholder="type password here" aria-label="password"/>
        </Form.Group>
        <Form.Label> Confirm Password </Form.Label>
        <Form.Group className='mb-3'>
            <Form.Control placeholder="type password again" aria-label="password"/>
        </Form.Group>
        <ButtonBootstrap type="submit" className='my-3'>Sign up</ButtonBootstrap>
      </Container>
    </div>
  )
}
