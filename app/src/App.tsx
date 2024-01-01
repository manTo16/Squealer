import { Routes, Route } from 'react-router-dom';

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



function App() {
  //const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div>
      <Navbar />

      {/* <SidebarComponent /> */}

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

      <div className='d-lg-none bottom-navbar'>
        <Bottombar/>
      </div>
    </div>
  );
}

export default App;
