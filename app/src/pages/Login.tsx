import React, {useState} from 'react'
import axios from '@root/axiosConfig'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ButtonBootstrap from 'react-bootstrap/Button'
import { Badge, Collapse, InputGroup } from 'react-bootstrap'
import Logo from '../assets/Squealer.png'
import { useNavigate } from 'react-router-dom'
import { apiAuthURL, apiUsersURL } from '../URLs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { error } from 'console'
import { AxiosError } from 'axios'

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
  const [isWriting, setIsWriting] = useState(false)
  const [error,setError]=useState(false)
  const navigate = useNavigate()

  const [errUserNotFound, setErrUserNotFound] = useState(false)
  const [errInvalidCredentials, setErrInvalidCredentials] = useState(false)

  const handleSubmit = async (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    let response
    setErrUserNotFound(false)
    setErrInvalidCredentials(false)
    try{
      response = await axios.post(apiAuthURL+'/login',{username,password})
      .then(response => {
        if (response.status === 200) return response
      })
      const token = response?.data.token
      alert('Success!')
      await getLoggedUserData(username)
      setUsername('')
      setPassword('')
      navigate('/')
      //window.location.reload();
      localStorage.setItem('token', token)
    }
    catch(error){
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 400 && (axiosError.response.data as {message: string}).message === "User not found") {
          setErrUserNotFound(true)
        } 
        else if (axiosError.response && axiosError.response.status === 401 && (axiosError.response.data as {message: string}).message === "Invalid credentials") {
          setErrInvalidCredentials(true)
        }
        else {
          throw error;
        }
      }
      else console.log("error", error)
    }
  }


  return (
    <div className="d-flex bg-dark">
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
          <Collapse in={errUserNotFound}>
              <div className='text-danger mb-3 mt-1'>
                Utente non esistente
              </div>
            </Collapse>
            <Collapse in={errInvalidCredentials}>
              <div className='text-danger mb-3 mt-1'>
                Password errata
              </div>
            </Collapse>
        </Row>
        <div>
          <Row className='d-flex mt-auto'>
            <Col xs={12} md={6}>
              <Form.Label> Username </Form.Label>
              <InputGroup className='mb-3 w-80'>
              <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control 
                    autoFocus 
                    onChange={(e)=>{setUsername(e.target.value); setIsWriting(true)}} 
                    value={username} 
                    placeholder="scrivi qui il tuo username" 
                    aria-label="username"
                  />
              </InputGroup>
              <Form.Label> Password </Form.Label>
              <InputGroup className='mb-3 w-80'>
                  <Form.Control 
                    onChange={(e)=>{setPassword(e.target.value); setIsWriting(true)}}
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
              <div className='d-flex justify-content-end align-items-center'>
                <ButtonBootstrap 
                  onClick={handleSubmit} 
                  type="submit" 
                  className='mb-2'
                  variant='success'
                >
                  Log in
                </ButtonBootstrap>
              </div>
              <div className='d-flex justify-content-end align-items-center'>
                <label className='text-light me-2'>Non hai un account?</label>
                <ButtonBootstrap 
                  onClick={()=>navigate('/register')}  
                  variant='light'
                >
                  Registrati
                </ButtonBootstrap>
              </div>
            </Col>
            <Col className='d-flex d-none d-md-block justify-content-center align-items-center'>
              { isWriting ? ( 
                <img className='my-3 mt-10' src={Logo} width={"100%"} alt=''/> 
                ) : ( 
                <img className='my-3 mt-10' src={Logo} width={"100%"} alt=''/> 
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}
