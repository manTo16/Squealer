
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@root/axiosConfig';
import Badge from 'react-bootstrap/Badge';
import { channelsURL } from '@root/src/URLs';

import Feed from '@components/Feed/Feed';
import { Button } from 'react-bootstrap';
import Gear from '@components/svg/GearSvg';

import { useContext } from 'react';
import { UserContext } from '@utils/userData';

const ChannelPage: React.FC = () => {
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
  const { channelName } = useParams<{ channelName: string }>();

  const navigate = useNavigate()

  return (
    <div>
        <div className='d-flex align-items-center mb-2 p-2 bg-dark rounded'>
          <h1 className='m-0'>§{channelName}</h1>

          {
            userDetails.ownedChannels.includes(channelName) && 
            <h5>
              <Badge pill bg="success" className='mt-2 ms-2'>Proprietario</Badge>
            </h5>
          }
          
          {
            userDetails.ownedChannels.includes(channelName) &&
            <Button
              onClick={() => navigate(`/channels/${channelName}/settings`)} 
              className='bg-transparent btn-outline-dark text-white'>
                <Gear/>
            </Button>
          }          
        </div>
        
        <Feed channelName={channelName} />
    </div>
  );
};

export default ChannelPage;


