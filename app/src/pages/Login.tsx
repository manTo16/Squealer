import React, {useState} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ButtonBootstrap from 'react-bootstrap/Button'
import Logo from '../assets/Squealer.png'
import { useNavigate } from 'react-router-dom'
import { apiAuthURL, apiUsersURL } from '../URLs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const getLoggedUserData = async (username: String) =>{
  try{
    const url=apiUsersURL+'/'+username
    const response = await axios.get(apiUsersURL+'/'+username)
    const user = response.data
    localStorage.setItem('user',JSON.stringify(user))
  }catch(err){
    console.log(err)
  }
}

export default function Login() {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    try{
      const response = await axios.post(apiAuthURL+'/login',{username,password})
      const token = response.data.token
      alert('Success!')
      await getLoggedUserData(username)
      setUsername('')
      setPassword('')
      navigate('/')
      //window.location.reload();
      localStorage.setItem('token', token)
    }
    catch(err){
      console.log(err)
    }
  }


  return (
    <div>
      <Container className='d-flex justify-content-center align-titems-cener flex-column auth-container'>
        <Row>
          <Col xs={12} md={6}>
            <h1>Log in to Squealer</h1>
            <Form.Label> Username </Form.Label>
            <Form.Group className='mb-3 w-80'>
                <Form.Control onChange={(e)=>setUsername(e.target.value)} value={username} placeholder="type username here" aria-label="username"/>
            </Form.Group>
            <Form.Label> Password </Form.Label>
            <Form.Group className='mb-3 w-80'>
                <Form.Control onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type password here" aria-label="password" type='password'/>
            </Form.Group>
            <ButtonBootstrap onClick={handleSubmit} type="submit" className='my-3 red-buttons'>Log in</ButtonBootstrap>
          </Col>
          <Col className='d-flex justify-content-center align-items-center'>
            <img className='my-3 mt-10' src={Logo} width={"100%"} alt=''/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
