import { Col, Row, Stack } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useNavigate, useParams } from "react-router-dom"
import Feed from '@components/Feed/Feed';
import { useEffect, useState } from "react"
import { apiUsersURL } from '@root/src/URLs';
import axios, { AxiosError } from "axios"

interface UserProps {
  user?: string;
}

export default function UserPage ({
    user
  } : UserProps ) {

  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate()
  const actualUser = () => {
    setUserData(userDetails)
  }
  
  useEffect(() => {
    !isLoggedIn ? navigate('/login') : console.log("logged in");
    console.log("username: ", username)
    if (username) {
      loadUserData();
    } else {
      actualUser();
    }
  }, [username])

  const loadUserData = async () => {
    const response = await axios.get(apiUsersURL + `/${username}`).then((response) => (response?.data));
    setUserData(response)
  }

  const [userData, setUserData] = useState({
    username: "",
    displayName: "",
    userImage: "",
    dailyChar: 0,
    weeklyChar: 0,
    monthlyChar: 0
  })

  return(
    <Form className='bg-dark rounded p-2 m-1'>
      <Row>
        <Col xs="auto" sm="auto" lg="auto" md="auto">
          <Button 
            className='btn btn-outline-dark'
            style={{background: 'transparent'}}
            // onClick={() => window.location.reload()}          
          >
            <Image src={`${userData.userImage}`} alt="user profile picture" width={250} fluid className='rounded-circle'/>
          </Button>
        </Col>
        <Col xs={12} sm={4}>
        <div className='pt-3'>
          <Row>
            <Col><h5>Nome:</h5></Col>
            <Col><h5>{userData.displayName}</h5></Col>
          </Row>
          <Row>
            <Col><h5>User:</h5></Col>
            <Col><h5>{'@'+userData.username}</h5></Col>
          </Row>
          <Row>
            <Col><h5>dChar:</h5></Col>
            <Col><h5>{userData.dailyChar}</h5></Col>
          </Row>
          <Row>
            <Col><h5>wChar:</h5></Col>
            <Col><h5>{userData.weeklyChar}</h5></Col>
          </Row>
          <Row>
            <Col><h5>mChar:</h5></Col>
            <Col><h5>{userData.monthlyChar}</h5></Col>
          </Row>
          <Row className='py-4'>
            <Button variant="success">Compra altri caratteri per i tuoi squeal</Button>
          </Row>
        </div>
        </Col>
      </Row>
      <hr/>

      <Feed searchQuery={userData.username} searchRoute="search/byUsername"/>

    </Form>
  )
}