import React from 'react'

function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  console.log(localStorage.getItem('user'))

  return (
    <div className='user-info'>
      <img src={`${userDetails.userImage}`} width={300}/>      
      <h3>{userDetails.displayName}</h3> 
      <h4>{'@'+userDetails.username}</h4>
      <p>Remaining charachers:</p>
    </div>
  )
}

export default UserInfo