import { ButtonGroup, Col, Row, Stack } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useNavigate, useParams } from "react-router-dom"
import Feed, { ReactionType } from "@components/Feed/Feed"
import { useContext, useEffect, useState } from "react"
import { apiUsersURL } from '@root/src/URLs';
import axios, { AxiosError } from "axios"
import WeeklyCalendar from '@components/svg/CharSvg/wCharSvg';
import MonthlyCalendar from '@components/svg/CharSvg/mCharSvg';
import DailyCalendar from '@components/svg/CharSvg/dCharSvg';
import { UserContext } from '@utils/userData';
import Heart from '@components/svg/Reaction/HeartSvg';
import Like from '@components/svg/Reaction/LikeSvg';
import Dislike from '@components/svg/Reaction/DislikeSvg';
import Heartbreak from '@components/svg/Reaction/HeartbreakSvg';


interface UserProps {
  user?: string;
}

export default function UserPage ({
    user
  } : UserProps ) {

  const isLoggedIn = !!localStorage.getItem('token')
  //const defaultValue = {}
  //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
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

  const [reactionType, setReactionType] = useState(ReactionType.Default)
  
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
            <Col lg={6} xs={6}><h5>Nome:</h5></Col>
            <Col lg={6} xs={6}><h5>{userData.displayName}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6}><h5>User:</h5></Col>
            <Col lg={6} xs={6}><h5>{'@'+userData.username}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className='d-flex align-text-center justify-content-start'> <DailyCalendar/> </Col>
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userDetails.dailyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className='d-flex align-text-center justify-content-start'> <WeeklyCalendar/> </Col>
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userDetails.weeklyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className='d-flex align-text-center justify-content-start'> <MonthlyCalendar/> </Col>
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userDetails.monthlyChar}</h5></Col>
          </Row>
        </div>
        </Col>
      </Row>
      <hr/>

      <h3>Visualizza: </h3>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" onClick={() => setReactionType(ReactionType.Default)}>Post</Button>
        <Button variant="secondary" onClick={() => setReactionType(ReactionType.VeryLike)}><Heart/></Button>
        <Button variant="secondary" onClick={() => setReactionType(ReactionType.Like)}><Like/></Button>
        <Button variant="secondary" onClick={() => setReactionType(ReactionType.Dislike)}><Dislike/></Button>
        <Button variant="secondary" onClick={() => setReactionType(ReactionType.VeryDislike)}><Heartbreak/></Button>
      </ButtonGroup>
      { 
      reactionType === ReactionType.Default ? (
          <Feed searchQuery={userData.username} searchRoute="search/byUsername"/>
        ) : (
          <Feed userName={userData.username} visualizedImpression={reactionType} />
        )
      }
    
    </Form>
  )
}