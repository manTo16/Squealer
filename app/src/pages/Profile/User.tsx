import { Badge, ButtonGroup, Col, Row, Spinner, Stack } from 'react-bootstrap';
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



/*
ERRORE IN CONSOLE:

Warning: Each child in a list should have a unique "key" prop.

Check the top-level render call using <span>. See https://reactjs.org/link/warning-keys for more information.
./src/components/Post/Post.tsx/_c<@http://localhost:3000/static/js/bundle.js:78984:102
Feed@http://localhost:3000/static/js/bundle.js:78161:14
form
_c@http://localhost:3000/static/js/bundle.js:33974:78
UserPage@http://localhost:3000/static/js/bundle.js:89441:18
RenderedRoute@http://localhost:3000/static/js/bundle.js:66633:7
Routes@http://localhost:3000/static/js/bundle.js:67338:7
div
div
./node_modules/react-bootstrap/esm/Col.js/_c<@http://localhost:3000/static/js/bundle.js:32564:14
div
./node_modules/react-bootstrap/esm/Row.js/_c<@http://localhost:3000/static/js/bundle.js:36901:97
div
./node_modules/react-bootstrap/esm/Container.js/_c<@http://localhost:3000/static/js/bundle.js:32733:103
div
App@http://localhost:3000/static/js/bundle.js:77332:88
Router@http://localhost:3000/static/js/bundle.js:67275:7
BrowserRouter@http://localhost:3000/static/js/bundle.js:65080:7
*/


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

  const [isLoadingSMMRequest, setIsLoadingSMMRequest] = useState(false)

  const sendSMMRequest = async () => {
    console.log("richiesta smm a: ", username)
    setIsLoadingSMMRequest(true)
    await axios.put(`${apiUsersURL}/smm/${userDetails.username}`,
                    {smm: username})
    
    //aggiorno i dati dell'utente quindi li richiedo dal server
    await fetchUserData()
    setIsLoadingSMMRequest(false)
  }

  const removeSMM = async () => {
    setIsLoadingSMMRequest(true)
    await axios.delete(`${apiUsersURL}/smm/${userDetails.username}`)
    
    await fetchUserData()
    setIsLoadingSMMRequest(false)
  }

  useEffect(() => {
    document.title = `@${username}`;
    return () => {
      document.title = 'Squealer';
    };
  }, [username]);
  
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
    <Form className='bg-dark rounded p-3 m-0'>
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
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userData.dailyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className='d-flex align-text-center justify-content-start'> <WeeklyCalendar/> </Col>
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userData.weeklyChar}</h5></Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className='d-flex align-text-center justify-content-start'> <MonthlyCalendar/> </Col>
            <Col lg={6} xs={6} className='pt-1 d-flex align-text-center justify-content-start'><h5>{userData.monthlyChar}</h5></Col>
          </Row>
        </div>
        </Col>
      </Row>

      { isLoadingSMMRequest ?
      (
        <Spinner animation='border' role='status'>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : 
      (
      userDetails.personalSMM === username ? 
        (
        <Button onClick={() => removeSMM()}>licenzia schiavo</Button>
        ) :
      (isLoggedIn && username)?   //va mostrato solo a chi è loggato e solo se non ci si trova in /profile (username è nei parametri url)
        (
        <Button onClick={() => sendSMMRequest()}>ti prego diventa il mio manager</Button>
        ) :
        <></>
      )}

      <hr/>
      <div className='d-flex'>
        <h4>Visualizza: <Badge pill bg="success"> {reactionType === ReactionType.Default ? 'post' : reactionType} </Badge> </h4>
        <ButtonGroup aria-label="Basic example" className='pb-2 ms-auto'>
          <Button variant="secondary" onClick={() => setReactionType(ReactionType.Default)}>Post</Button>
          <Button variant="secondary" onClick={() => setReactionType(ReactionType.VeryLike)}><Heart/></Button>
          <Button variant="secondary" onClick={() => setReactionType(ReactionType.Like)}><Like/></Button>
          <Button variant="secondary" onClick={() => setReactionType(ReactionType.Dislike)}><Dislike/></Button>
          <Button variant="secondary" onClick={() => setReactionType(ReactionType.VeryDislike)}><Heartbreak/></Button>
        </ButtonGroup>
      </div>
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