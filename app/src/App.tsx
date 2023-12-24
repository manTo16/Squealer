import { Routes, Route } from 'react-router-dom';
import TrendingPage from './pages/TrendingPage';
import Bottombar from './components/Bottombar';
import NewPostPage from './pages/NewPost';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import "./components/Bottombar.css"
import Login from './pages/Login';
import Home from './pages/Home';
import Feed from './components/Feed/Feed';
import React from 'react';



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
        {/* <Route path='/charShop'         element={< />}          /> */}
      </Routes>

      <div className='d-lg-none bottom-navbar'>
        <Bottombar/>
      </div>
    </div>
  );
}

export default App;
