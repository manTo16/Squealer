import Button from 'react-bootstrap/Button';
import Logout from '../svg/LogoutSvg';

import { useNavigate } from 'react-router-dom';
import axios from '@root/axiosConfig';
import { apiUsersURL } from '../../URLs';

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@utils/userData';

import "../../pages/Home.css";

import { UserDetailsInterface } from "@utils/userData";

export default function SidebarContent(
  { handleShow = (input: boolean) => {} }: { handleShow?: (input: boolean) => void }
  ) {
  const userToken = localStorage.getItem('token');
  //const defaultValue = {}
  //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
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
    updateUserDataFromLS()
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

    // carica i dati dei canali solo se sei loggato e se ha caricato in tempo i dati dell'utente
    //if (userToken && username) fetchChannels();
    //alla fine è abbastanza inutile chiamare questa funzione. se teniamo aggiornato l'userDetails sta tutto lì
    //tra un po' magari eliminiamo direttamente il codice. per ora lo teniamo magari alla fine serve
  }, [])
  
  return(
    <div className='bg-dark content-wrapper h-100'>

      {
        userToken ? 
        (
        <div className="d-flex justify-content-around pt-4">
          <Button 
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
      <hr />
      { userToken ? ( 
      <>
        <div className='d-flex flex-column home'>
          <Button
            className="m-2" variant='light'
            onClick={() => {navigate("/createChannel"); handleShow(false)}}
          >
            Crea Canale
          </Button>
          <Button
            className="m-2" variant='success'
            onClick={() => {navigate("/charShop"); handleShow(false)}}>
            Compra caratteri
          </Button>
        </div>
        <hr />
      <h3 className="normal-text mt-3 mb-3 text-center">I tuoi canali</h3> 
      </>
      ) : (<h3 className="normal-text mt-3 mb-3 text-center">Canali consigliati</h3>) }

      <hr/>
      <div className="p-2" style={{display: 'grid'}}>
        
        {
        userToken ? 
        (
          <>
            {userDetails.ownedChannels && 
            userDetails.ownedChannels.map((channelName: string, index: number) =>
            <Button key={index} 
              className="mb-2"
              onClick={() => {navigate(`/channels/${channelName}`); handleShow(false)}}
              variant="outline-light">
              {channelName}
            </Button>  )
            }

            <hr/>

            <h3 className="normal-text mt-2 mb-3 text-center">Iscrizioni</h3> 
          
            {userDetails.channels && 
              userDetails.channels.map((channelName: string, index: number) =>
              <Button key={index} 
                className="mb-2"
                onClick={() => {navigate(`/channels/${channelName}`); handleShow(false)}}
                variant="outline-light">
                {channelName}
              </Button>  )
            }

          </>
          ):
        (
          <>
            <Button variant="outline-light m-1">§ TRENDING</Button>
            <Button variant="outline-light m-1">§ NEWS</Button>
            <Button variant="outline-light m-1">§ WIKI-RAND-PG</Button>
            <Button variant="outline-light m-1">cronologia</Button>
            <hr />
          </>
        )}
      </div>
    </div>
  )
}