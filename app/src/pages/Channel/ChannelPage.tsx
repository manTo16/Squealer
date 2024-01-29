
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@root/axiosConfig';
import Badge from 'react-bootstrap/Badge';
import { channelsURL } from '@root/src/URLs';

import Feed from '@components/Feed/Feed';
import { Button, Spinner } from 'react-bootstrap';
import Gear from '@components/svg/GearSvg';

import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@utils/userData';
import { AxiosError } from 'axios';

import { UserDetailsInterface } from "@utils/userData";

const ChannelPage: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token')
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
  const { channelName } = useParams<{ channelName: string }>();

  const [subReqIsLoading, setSubReqIsLoading] = useState(false)

  type ChannelData = {
    channelName: string;
    description: string;
    reserved: boolean;
    usernames: {
      owners: string[];
      writers: string[];
      readers: string[];
      subs: string[];
    };
  };
  const [channelData, setChannelData] = useState<ChannelData>({
    channelName: "",
    description: "",
    reserved: false,
    usernames: {
        owners: [],
        writers: [],
        readers: [],
        subs: []
    }
  })

  const sendSubRequest = async () => {
    setSubReqIsLoading(true)
    await axios.put(channelsURL+"/sub/"+channelName, {username: userDetails.username})
    await fetchUserData()
    setSubReqIsLoading(false)
  }

  const sendUnSubRequest = async () => {
    setSubReqIsLoading(true)
    await axios.patch(channelsURL+"/unsub/"+channelName, {username: userDetails.username})
    await fetchUserData()
    setSubReqIsLoading(false)
  }

  useEffect(() => {
    const fetchChannelData = async () => {
        try {
            const response = await axios.get(channelsURL+"/data/"+channelName).then(response => response.data)
            setChannelData(response)
        } catch (error) {
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                  console.log("ChannelSettingPage 404 con channelName: ", channelName);
                } else {
                  throw error;
                }
            }
        }
    }
    fetchChannelData()
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    document.title = `§${channelName}`;
    return () => {
      document.title = 'Squealer';
    };
  }, [channelName]);

  return (
    <div>
        <div className='d-flex align-items-center p-2 bg-secondary'>
          <h1 className='m-0'>§{channelName}</h1>

          {isLoggedIn && userDetails.ownedChannels.includes(channelName?? "") && 
          <>
            <h5>
              <Badge pill bg="success" className='mt-2 ms-2'>Proprietario</Badge>
            </h5>
          
            <div className='ms-auto'>
              <Button
                onClick={() => navigate(`/channels/${channelName}/settings`)} 
                className=' bg-transparent btn-outline-dark text-white'>
                  <Gear/>
              </Button>
            </div>      
          </>
          }    
        </div>
        <div className='bg-secondary mb-2'>
          <p>{channelData.description}</p>
          <div className='nonloso'>{channelData.usernames.subs.length} iscritti 
          <span>
            { subReqIsLoading ? 
            (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) :
            (
              userDetails.channels.includes(channelName ?? "") ?
              (
                <Button onClick={sendUnSubRequest}>Disiscriviti</Button>
              ) :
              (
                <Button onClick={sendSubRequest}>Iscriviti</Button>
              )
            )
            }
          </span>
          </div> 
        </div>
        
        <Feed channelName={channelName} />
    </div>
  );
};

export default ChannelPage;


