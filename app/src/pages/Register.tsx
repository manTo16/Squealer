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


  const [usernameError, setUsernameError] = useState(false)
  const [usernameExistsError, setUsernameExistsError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);

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

    let errorFound = false;

    // Controllo dei campi - password, email, username
    if (password!==confirmPassword){
      setPasswordMatchError(true)
      errorFound = true;
    }
    if (password.length<8){
      setPasswordLengthError(true)
      errorFound = true;
    }
    if(!email.includes('@' && '.')){
      setEmailError(true)
      errorFound = true;
    }
    // username senza spazi e con solo caratteri alfanumerici e più lungo di 3 caratteri
    if( !/^[a-zA-Z0-9_]*$/.test(username) || username.length<3){
      setUsernameError(true)
      errorFound = true;
    }
    // nome senza spazi e con solo caratteri alfanumerici e più lungo di 3 caratteri
    if( !/^[a-zA-Z0-9_]*$/.test(displayName) || displayName.length<3 ){
      setNameError(true)
      errorFound = true;
    }


    if (errorFound) return; // Evitiamo di fare la richiesta se ci sono errori



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
    }).catch((err)=> {
      console.log(err)
      
      // Your error handling logic
      if (err?.response?.data?.message && typeof err.response.data.message === 'string') {
        if (err.response.data.message.includes('E11000')) {
          setUsernameExistsError(true);
        }
      } else {
        // Handle nel caso di altri errori ancora
        console.error("An unexpected error occurred", err);
      }
    })
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
                      onChange={(e)=>{setDisplayName(e.target.value); setNameError(false)}}
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
                    onChange={(e)=>{setUsername(e.target.value); setUsernameError(false); setUsernameExistsError(false)}}
                    value={username}
                    placeholder="type username here"
                    aria-label="username"/>
                </InputGroup>
              </Col>
                { usernameError ? ( <><p className='text-danger'>L'username deve essere lungo 3 caratteri e contenere solo caratteri alfanumerici </p></> ) :( <></> ) }
                { usernameExistsError ? ( <><p className='text-danger'>L'username è già in uso, scegline un altro</p></> ) :( <></> ) }
                { nameError ? ( <><p className='text-danger'>Il nome deve essere lungo 3 caratteri e contenere solo caratteri alfanumerici </p></> ) :( <></> )}
            </Row>
            <Form.Label> La tua email </Form.Label>
            <InputGroup className='mb-3'>
                <Form.Control 
                  onChange={(e)=>{setEmail(e.target.value); setEmailError(false)}}
                  value={email}
                  isInvalid={email.length>0 && !email.includes('@' && '.') }
                  placeholder="type email here"
                  aria-label="email"/>
            </InputGroup>
                { emailError ? ( <><p className='text-danger'>L'email non è scritta correttamente</p></> ) :( <></> ) }
            <Row>
              <Col>
                <Form.Label> Crea una password </Form.Label>
                <InputGroup className='mb-3'>
                    <Form.Control
                      onChange={(e)=>{setPassword(e.target.value); setPasswordLengthError(false); setPasswordMatchError(false);}}
                      value={password}
                      isInvalid={passwordMatchError || passwordLengthError || (password.length>0 && password.length<8)  }
                      placeholder="type password here"
                      aria-label="password"
                      type='password'/>
                </InputGroup>
                { passwordLengthError ? ( <><p className='text-danger'>La password deve essere più lunga di 8 caratteri</p></> ) :( <></> ) }
              </Col>
              <Col>
                <Form.Label> Conferma Password </Form.Label>
                <InputGroup className='mb-3'>
                    <Form.Control
                      onChange={(e)=>{setConfirmPassword(e.target.value); setPasswordMatchError(false);}}
                      value={confirmPassword}
                      isInvalid={passwordMatchError || (password.length>0 && password.length<8) || (password!==confirmPassword) }
                      placeholder="type password again"
                      aria-label="password"
                      type='password'/>
                </InputGroup>
                { passwordMatchError ? ( <><p className='text-danger'>Le password non corrispondono</p></> ) :( <></> ) }
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
