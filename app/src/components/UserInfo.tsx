import React from 'react'
import ThirdColumn from './ThirdColumn/ThirdColumn'
import Char4LG from './Char indicator/Char4LGscreen'

import tmpropic from '../assets/person/9.png' // solo per visualizzazione

function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  //console.log(localStorage.getItem('user'))

  return (
    <div className="bg-dark rounded">
      <a style={{ textDecoration: 'none' }} className="d-flex justify-content-around" href="/profile">
        <img src={`${userDetails.userImage}`} width={100} className='py-4 rounded-circle'/>
        <div className='p-3'>
          <h3>{userDetails.displayName}</h3> 
          <h4>{'@'+userDetails.username}</h4>
          <h5>{userDetails.dailyChar}</h5>
        </div>
      </a>
      <Char4LG />
      <ThirdColumn />
    </div>
  )
}

export default UserInfo