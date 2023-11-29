import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bottombar from './components/Bottombar';
import NewPostPage from './pages/NewPost';
import TrendingPage from './pages/TrendingPage';



function App() {
  //const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div>
      <Navbar />

      {/* <SidebarComponent /> */}

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/newPost' element={<NewPostPage />}/>
        <Route path='/trendingPage' element={<TrendingPage />}/>
      </Routes>

      <div className='d-lg-none'>
      <Bottombar/>
      </div>
    </div>
  );
}

export default App;
