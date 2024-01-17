import React from 'react'
import ThirdColumn from './ThirdColumn/ThirdColumn'
import Char4LG from './Char indicator/Char4LGscreen'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  //console.log(localStorage.getItem('user'))

  const navigate = useNavigate()

  return (
    <div className="bg-dark rounded">
      <Button 
        className='btn btn-outline-dark d-flex'
        style={{background: 'transparent'}}
        onClick={() => navigate("/profile")}
      >
        <img src={`${userDetails.userImage}`} alt="user profile picture" width={100} className='py-4 rounded-circle'/>
        <div className='p-3 text-white'>
          <h3>{userDetails.displayName}</h3> 
          <h4>{'@'+userDetails.username}</h4>
          <h5>{userDetails.dailyChar}</h5>
        </div>
      </Button>
      {/* <a style={{ textDecoration: 'none' }} className="d-flex justify-content-around" href="/profile">
      </a> */}
      <Char4LG />
      <ThirdColumn />
    </div>
  )
}

export default UserInfo