import React, {useState} from 'react'
import axios from '@root/axiosConfig'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ButtonBootstrap from 'react-bootstrap/Button'
import { Badge, InputGroup } from 'react-bootstrap'
import Logo from '../assets/Squealer.png'
import { useNavigate } from 'react-router-dom'
import { apiAuthURL, apiUsersURL } from '../URLs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { error } from 'console'

const getLoggedUserData = async (username: String) =>{
  try{
    const url=apiUsersURL+'/'+username
    const response = await axios.get(apiUsersURL+'/'+username)
    const user = response.data
    localStorage.setItem('user',JSON.stringify(user))
  }catch(err){
    console.log("GETerror", err)
  }
}

export default function Login() {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(false)
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
      console.log("error", err)
    }
  }


  return (
    <div>
      <Container className='d-flex justify-content-center align-titems-cener flex-column pt-2 bg-dark rounded-bottom'>
        <Row>
          <Col>
            <hr />
            <div className='d-flex justify-content-center'>
              <h1>Log in to <strong><Badge pill bg="success">Squealer</Badge></strong></h1>
            </div>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Form.Label> Username </Form.Label>
            <InputGroup className='mb-3 w-80'>
            <InputGroup.Text>@</InputGroup.Text>
                <Form.Control 
                  autoFocus 
                  onChange={(e)=>setUsername(e.target.value)} 
                  value={username} 
                  placeholder="scrivi qui il tuo username" 
                  aria-label="username"
                />
            </InputGroup>
            <Form.Label> Password </Form.Label>
            <InputGroup className='mb-3 w-80'>
                <Form.Control 
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password} 
                  isInvalid={error}
                  placeholder="type password here" 
                  aria-label="password" 
                  type='password'
                />
            </InputGroup>
            { error ? ( <><p className='text-danger'>La password è corretta</p></> ) :( <></> ) }
            <div className='pt-3'>
              <hr />
            </div>
            <div className='d-flex justify-content-end'>
              <ButtonBootstrap 
                onClick={handleSubmit} 
                type="submit" 
                className='my-3' 
                variant='success'
              >
                Log in
              </ButtonBootstrap>
            </div>
          </Col>
          <Col className='d-flex d-none d-md-block justify-content-center align-items-center'>
            <img className='my-3 mt-10' src={Logo} width={"100%"} alt=''/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
