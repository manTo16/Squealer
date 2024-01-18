import Button from 'react-bootstrap/Button';
import Logout from '../svg/LogoutSvg';

import { useNavigate } from 'react-router-dom';
import axios from '@root/axiosConfig';
import { apiUsersURL } from '../../URLs';

import { useState, useEffect } from 'react';



export default function SidebarContent(
  { handleShow = (input: boolean) => {} }: { handleShow?: (input: boolean) => void }
  ) {
  const userToken = localStorage.getItem('token');
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const username = userDetails.username
  const navigate = useNavigate()

  const handleLogout = (e:React.MouseEvent<HTMLButtonElement>) => {
    localStorage.clear()
    handleShow(false)
    navigate('/')
    window.location.reload();
  }

  const [displayedChannels, setDisplayedChannels] = useState<string[]>([])

  useEffect(() => {
    const loadChannels = async () => {
      const response = await axios.get(apiUsersURL+`/${username}/channels`,
      { headers: {"Authorization": `Bearer ${userToken}`}})
      console.log("loadChannels response", response)
      let channelsArray = []
      if (response && response.status === 200) channelsArray = response.data
      console.log("loadChannels channelsarray", channelsArray, "(response.status: ", response?.status, ")")
      return channelsArray
    }

    const fetchChannels = async () => {
      setDisplayedChannels(await loadChannels());
    }

    // fetch channels data only if logged in
    if (userToken) fetchChannels();
  }, [])
  
  return(
  <div className='bg-dark rounded'>

      {
        userToken ? 
        (
        <div className="d-flex justify-content-around pt-4">
          <Button className="Logout" 
          variant="outline-light"
          onClick={handleLogout}>
            <div className='d-flex align-items-center'>
              Log Out 
              <Logout className='mx-2'/>
            </div>
          </Button>
        </div>
        ) :
        (
        <div className="d-flex justify-content-around pt-4">
          <Button onClick={()=>{
                                navigate("/login")
                                handleShow(false)}} 
            variant="outline-light">
            LogIn
          </Button>
          <Button onClick={()=>{
                                navigate("/register")
                                handleShow(false)}} 
            variant="outline-light">
            Register
          </Button>
        </div>
        )
      }

      <h3 className="normal-text mt-5 mb-3 text-center">Canali consigliati</h3>
      <hr/>
      <div className="channels-wrapper p-2">
        
        {
        userToken ? 
        (
          <>
            <Button
              className="mb-2" variant='success'
              onClick={() => {navigate("/charShop"); handleShow(false)}}>
              Compra caratteri
            </Button>
            
            {
            displayedChannels.map((channelName, index) =>
            <Button key={index} 
              className="mb-2"
              onClick={() => {navigate(`/channels/${channelName}`)}}
              variant="outline-light">
              {channelName}
            </Button>  )
            }
          
          </>
          ):
        (
        <>
        <Button variant="outline-light m-1">
          § TRENDING
        </Button>
        <Button variant="outline-light m-1">
          § NEWS
        </Button>
        <Button variant="outline-light m-1">
          § WIKI-RAND-PG
        </Button>
        <Button variant="outline-light m-1">
          cronologia
        </Button>
        </>
        )
        }
       
      </div>
  </div>
  )
}