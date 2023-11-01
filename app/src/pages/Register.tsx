import React,{useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ButtonBootstrap from 'react-bootstrap/Button'
import Logo from '../assets/squealer-logo.png'
import { useNavigate } from 'react-router-dom'
import { apiAuthURL, apiUsersURL } from '../URLs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { convertToBase64 } from '../utils'

export default function Register() {
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [displayName,setDisplayName]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [userImage,setUserImage]=useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = () => {
    axios
    .get(apiUsersURL)
    .then((res) => {
        console.log(res.data)
    })
  }
  

  const handleSubmit = (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if (password!==confirmPassword){
      alert('The passwords are different!')
      return;
    }
    axios.post(apiAuthURL+'/register', {username,displayName,email,password, userImage })
    .then(()=>{
      alert('Success!')
      setUsername('')
      setDisplayName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setUserImage('')
      navigate('/login')
    }).catch((err)=>console.log(err))
  }

  const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const file = e.target.files[0];
    const convertedImage: any = await convertToBase64(file)
    console.log(convertedImage)
    setUserImage(convertedImage)
  }
  
  return (
    <div> 
      <Container className='d-flex justify-content-center align-items-center flex-column my-10 container-md auth-container'>
        <Row>
          <Col>
            <h1>Sign up to Squealer</h1>
            <Form.Label> Choose displayed name </Form.Label>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setDisplayName(e.target.value)} value={displayName} placeholder="type username here" aria-label="username"/>
            </Form.Group>
            <Form.Label> Create username </Form.Label>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setUsername(e.target.value)} value={username} placeholder="type username here" aria-label="username"/>
            </Form.Group>
            <Form.Label> Your email </Form.Label>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="type email here" aria-label="email"/>
            </Form.Group>
            <Form.Label> Create password </Form.Label>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type password here" aria-label="password" type='password'/>
            </Form.Group>
            <Form.Label> Confirm Password </Form.Label>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="type password again" aria-label="password" type='password'/>
            </Form.Group>
            <Form.Label> Upload profile picture</Form.Label>
            <Form.Group className='mb-3'>
                <input aria-label="upload-image" type='file' accept='.jpeg, .png, .jpg' name='image' onChange={(e)=>handleImageUpload(e)}/>                
            </Form.Group>
            <ButtonBootstrap onClick={handleSubmit} type="submit" className='my-3 red-buttons'>Sign up</ButtonBootstrap>
          </Col>
          <Col className='d-flex justify-content-center align-items-center'>
            <img className='my-3 mt-10' src={Logo} width={400} alt=''/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
