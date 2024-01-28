import { Routes, Route, useLocation } from 'react-router-dom';

import { useContext, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TrendingPage from './pages/TrendingPage';
import NewPostPage from './pages/NewPost';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ChannelPage from './pages/Channel/ChannelPage';
import SearchPage from './pages/SearchPage';

import Bottombar from './components/Bottombar';
import Navbar from './components/Navbar';
import Feed from './components/Feed/Feed';
import UserInfo from '@components/UserInfo';
import SidebarContent from '@components/Sidebar/SidebarContent';
import ProfilePage from './pages/Profile/Profile';
import Post from '@components/Post/Post';
import UserPage from './pages/Profile/User';
import CharShopPage from './pages/CharShopPage';
import ChannelCreationPage from './pages/Channel/ChannelCreationPage';
import QuestionPage from './pages/QuestionPage';

import { UserContext, getPersonalUserData } from '@utils/userData';
import { createViewedPostsList } from '@utils/guestUsers';

import ChannelSettingsPage from './pages/Channel/ChannelSettingPage';
import { useParams } from 'next/navigation';
import KeywordPage from './pages/KeywordPage';

function App() {
  const isLoggedIn = !!localStorage.getItem('token')
  const localUserDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}

  const [userDetails, setUserDetails] = useState(localUserDetails)
  const fetchUserData = async () => {
    setUserDetails(await getPersonalUserData(localUserDetails.username))
  }
  const updateUserDataFromLS = () => {
    setUserDetails(localUserDetails)
  }

  useEffect(() => {
    if (isLoggedIn) fetchUserData().then(() => setIsLoading(false))
    else {
      setUserDetails(localUserDetails)
      createViewedPostsList()
      setIsLoading(false)
    }
  }, [])

  const [navbarHeight, setNavbarHeight] = useState(0)
  const [bottombarHeight, setBottombarHeight] = useState(0)

  useEffect(() => {
    console.log("navbarHeight: ", navbarHeight)
    console.log("bottombarHeight: ", bottombarHeight)
  }, [navbarHeight, bottombarHeight])


  const location = useLocation();
  const renderSidebars = (location.pathname !== "/login" && location.pathname !== "/register")

  const [isLoading, setIsLoading] = useState(true)


  return (
    <div>
      <UserContext.Provider value={{userDetails, fetchUserData, updateUserDataFromLS}}>
        
      <Navbar
      onHeightChange={setNavbarHeight} />

      <Container fluid>
      <Row xs={12} lg={12} className='justify-content-md-center'>

        {renderSidebars &&
        <Col xs={0} lg={3} xxl={{ span: 2, offset: 1 }} className='d-none d-lg-block'>
          <div style={{height: window.innerHeight - navbarHeight - bottombarHeight - 10}}>
            <SidebarContent />
          </div>
        </Col>
        }

        {/* <SidebarComponent /> */}
        <Col xs={12} lg={6} className='content-wrapper p-0'>
          <div style={{
            // overflow: "scroll", 
          height: window.innerHeight - navbarHeight - bottombarHeight - 10}}
          >

          <Routes>
            <Route path='/'                               element={<Home />}                      />
            <Route path='/login'                          element={<Login />}                     />
            <Route path='/register'                       element={<Register />}                  />
            <Route path='/newPost'                        element={<NewPostPage />}               />
            <Route path='/newPost/reply/:replyPostId'     element={<NewPostPage />}               />
            <Route path='/trendingPage'                   element={<TrendingPage />}              />
            <Route path='/feed'                           element={<Feed />}                      />
            <Route path='/profile'                        element={<ProfilePage />}               />
            <Route path='/channels/:channelName'          element={<ChannelPage />}               />
            <Route path='/channels/:channelName/settings' element={<ChannelSettingsPage />}       />
            <Route path='/posts/:id'                      element={<Post postId='getFromUrl' />}  />
            <Route path='/search/:query'                  element={<SearchPage />}                />
            <Route path='/users/:username'                element={<UserPage />}                  />
            <Route path='/charShop'                       element={<CharShopPage />}              />
            <Route path='/createChannel'                  element={<ChannelCreationPage />}       />
            <Route path='/question'                       element={<QuestionPage />}              />
            <Route path='/keywords/:keyword'              element={<KeywordPage />} />
            {/* <Route path='/charShop'         element={< />}          /> */}
          </Routes>

          </div>
        </Col>


        {renderSidebars && (
        isLoggedIn ?
        (
          <>
      
          <Col xs={0} lg={2} className='d-none d-lg-block'>
            <UserInfo />
          </Col>
           <Col xs={0} xxl={1}>
            <></>
          </Col>
          </>
        )
        :
        (
          /* colonna vuota visto che da sloggati si possono leggere solo i canali principali */
          <Col xs = {0} lg={3} className='d-none d-lg-block'> <></> </Col>
        )
      
        )}
        
      </Row>
      </Container>
      <Row>
        <Col >
          <div className='d-lg-none'>
            <Bottombar
            onHeightChange={setBottombarHeight}/>
          </div>
        </Col>
      </Row>

      </UserContext.Provider>
    </div>
  );
}

export default App;
