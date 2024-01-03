import { Routes, Route } from 'react-router-dom';

import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TrendingPage from './pages/TrendingPage';
import NewPostPage from './pages/NewPost';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ChannelPage from './pages/ChannelPage';

import Bottombar from './components/Bottombar';
import Navbar from './components/Navbar';
import "./components/Bottombar.css"
import Feed from './components/Feed/Feed';
import UserInfo from '@components/UserInfo';
import SidebarContent from '@components/Sidebar/SidebarContent';



function App() {
  const isLoggedIn = !!localStorage.getItem('token')

  const [navbarHeight, setNavbarHeight] = useState(0)
  const [bottombarHeight, setBottombarHeight] = useState(0)

  useEffect(() => {
    console.log("navbarHeight: ", navbarHeight)
    console.log("bottombarHeight: ", bottombarHeight)
  }, [navbarHeight, bottombarHeight])

  return (
    <div>
      <Navbar
      onHeightChange={setNavbarHeight} />

      <Container fluid>
      <Row xs={12} lg={12}>

        
        <Col xs={0} lg={{ span: 2, offset: 1 }} className='d-none d-lg-block'>
          <SidebarContent />
        </Col>

        {/* <SidebarComponent /> */}
        <Col xs={12} lg={6} className='content-wrapper'>
          <div style={{overflow: "scroll", 
          height: window.innerHeight - navbarHeight - bottombarHeight - 5}}>

          <Routes>
            <Route path='/'             element={<Home />}          />
            <Route path='/login'        element={<Login />}         />
            <Route path='/register'     element={<Register />}      />
            <Route path='/newPost'      element={<NewPostPage />}   />
            <Route path='/trendingPage' element={<TrendingPage />}  />
            <Route path='/feed'         element={<Feed />}          />
            <Route path='/channels/:channelName' element={<ChannelPage />} />
            {/* <Route path='/charShop'         element={< />}          /> */}
          </Routes>
          </div>

        </Col>

          {/* invisibile per 'xs', occupa 3 per 'lg' */}
          {
            isLoggedIn ?
            (
              <Col xs={0} lg={3} className='d-none d-lg-block'>
                <UserInfo />
              </Col>
            )
            :
            (
              /* colonna vuota visto che da sloggati si possono leggere solo i canali principali */
              <Col xs = {0} lg = {3} className='d-none d-lg-block'> <></> </Col>
            )
          }


        
      </Row>
      </Container>

      <div className='d-lg-none bottom-navbar'>
        <Bottombar
        onHeightChange={setBottombarHeight}/>
      </div>
      
    </div>
  );
}

export default App;
