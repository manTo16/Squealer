import React from 'react'

function UserInfo() {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  console.log(localStorage.getItem('user'))
  //localStorage.clear()

  return (
    <div className='user-info'>
      <img src='../assets/squealer-logo.png' />
      {/* <h3>{userDetails.displayName}</h3> */}
      <h4>username</h4>
      <p>character remaining</p>
    </div>
  )
}

export default UserInfo