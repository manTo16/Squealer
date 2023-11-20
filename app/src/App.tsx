import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// import SidebarComponent from './components/Sidebar/SidebarComponent';


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
      </Routes>
    </div>
  );
}

export default App;
