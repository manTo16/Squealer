import React,{useState, useEffect } from 'react'
import axios from '@root/axiosConfig'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ButtonBootstrap from 'react-bootstrap/Button'
import Logo from '../assets/Squealer.png'
import gif from '../assets/volture-whait.gif'
import { useNavigate } from 'react-router-dom'
import { apiAuthURL, apiUsersURL } from '../URLs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { convertToBase64 } from '../utils'
import { Badge, InputGroup } from 'react-bootstrap'

export default function Register() {
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [displayName,setDisplayName]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [userImage,setUserImage]=useState('')
  const navigate = useNavigate()
  const [error, setError] = useState(false);

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
      setError(true)
      return;
    }
    axios.post(apiAuthURL+'/register', {username,displayName,email,password, userImage })
    .then(()=>{
      console.log('inizio')
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
      <Container className='pt-2 bg-dark rounded-bottom'>
        <Row>
          <Col>
            <hr />
            <div className='d-flex justify-content-center'>
              <h1>Iscriviti a <strong><Badge pill bg="success">Squealer</Badge></strong></h1>
            </div>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            <Row>
              <Col>
                <Form.Label> Scegli il tuo nome </Form.Label>
                <InputGroup className='mb-3 w-80'>
                    <Form.Control 
                      autoFocus
                      onChange={(e)=>setDisplayName(e.target.value)}
                      value={displayName}
                      placeholder="type displayed name here"
                      aria-label="username"/>
                </InputGroup>
              </Col>
              <Col>
                <Form.Label> Crea un username </Form.Label>
                
                <InputGroup className='mb-3'>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    onChange={(e)=>setUsername(e.target.value)}
                    value={username}
                    placeholder="type username here"
                    aria-label="username"/>
                </InputGroup>
              </Col>
            </Row>
            <Form.Label> La tua email </Form.Label>
            <InputGroup className='mb-3'>
                <Form.Control 
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  isInvalid={email.length>0 && !email.includes('@' && '.') }
                  placeholder="type email here"
                  aria-label="email"/>
            </InputGroup>
            <Row>
              <Col>
                <Form.Label> Crea una password </Form.Label>
                <InputGroup className='mb-3'>
                    <Form.Control
                      onChange={(e)=>setPassword(e.target.value)}
                      value={password}
                      isInvalid={error || (password.length>0 && password.length<8) }
                      placeholder="type password here"
                      aria-label="password"
                      type='password'/>
                </InputGroup>
                { error ? ( <><p className='text-danger'>Le password non corrispondono</p></> ) :( <></> ) }
              </Col>
              <Col>
                <Form.Label> Conferma Password </Form.Label>
                <InputGroup className='mb-3'>
                    <Form.Control
                      onChange={(e)=>setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      isInvalid={error || (password.length>0 && password.length<8) }
                      placeholder="type password again"
                      aria-label="password"
                      type='password'/>
                </InputGroup>
              </Col>
            </Row>
            

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Carica una foto profilo</Form.Label>
              <Form.Control 
                type="file" 
                accept=".jpeg, .png, .jpg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e)}
              />
            </Form.Group>
            <br />
            <hr />

            <div className='d-flex justify-content-end'>
              <ButtonBootstrap
                onClick={handleSubmit}
                type="submit"
                variant='success'
                className='my-3'
              >
                Sign up
              </ButtonBootstrap>
            </div>
          </Col>

          <Col className='d-flex d-none d-md-block justify-content-center align-items-center'>
            <img className='my-3 mt-10' src={Logo} width={"100%"} alt=''/>
            {/* <Figure>
            <Figure.Image
              width={171}
              height={180}
              alt="171x180"
              src={gif}/>
            </Figure>  */}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
