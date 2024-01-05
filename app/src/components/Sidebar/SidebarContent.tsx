import Button from 'react-bootstrap/Button';
import Logout from '../svg/LogoutSvg';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { channelsURL,apiUsersURL } from '../../URLs';

import { useState, useEffect } from 'react';

export default function SidebarContent() {
  const userToken = localStorage.getItem('token');
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const username = userDetails.username
  const navigate = useNavigate()

  const handleLogout = (e:React.MouseEvent<HTMLButtonElement>) => {
    localStorage.clear()
    navigate('/')
    window.location.reload();
  }

  const [displayedChannels, setDisplayedChannels] = useState<string[]>([])

  useEffect(() => {
    const loadChannels = async () => {
      const response = await axios.get(apiUsersURL+`/${username}/channels`,
      { headers: {"Authorization": `Bearer ${userToken}`}})
      let channelsArray = response.data
      console.log("loadChannels channelsarray", channelsArray)
      return channelsArray
    }

    const fetchChannels = async () => {
      setDisplayedChannels(await loadChannels());
    }

    // fetch channels data only if logged in
    if (userToken) fetchChannels();
  }, [])
  
  return(
  <div>

      {
        userToken ? 
        (
        <div className='logged-in-buttons'>
          <Button className="Logout" 
          variant="outline-light"
          onClick={handleLogout}>
            Log Out 
            <Logout/>
          </Button>
        </div>
        ) :
        (
        <div className='logged-out-buttons'>
          <Button variant="outline-light" href="/login">
            Log in
          </Button>
          <Button variant="outline-light" href="/register">
            Register
          </Button>
        </div>
        )
      }

      <h3 className="normal-text mt-5 mb-3">Canali consigliati</h3>
      <div className="channels-wrapper">
        
        {
        userToken ? 
        (
          displayedChannels.map((channelName, index) =>
          <Button key={index} 
          className="mb-2"
          href={`/channels/${channelName}`}
          variant="outline-light">
            {channelName}
          </Button>  )
          ):
        (
        <>
        <Button variant="outline-light">
          canale 1
        </Button>
        <Button variant="outline-light">
          canale 2
        </Button>
        <Button variant="outline-light">
          canale x
        </Button>
        <Button variant="outline-light">
          cronologia
        </Button>
        </>
        )
        }
       
      </div>
  </div>
  )
}