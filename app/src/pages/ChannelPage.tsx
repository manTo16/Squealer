
import { useParams } from 'react-router-dom';
import axios from '@root/axiosConfig';

import { channelsURL } from '../URLs';

import Feed from '@components/Feed/Feed';

const ChannelPage: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();

  return (
    <div>
        <div className='d-flex mb-2 p-2 bg-dark rounded'>
          <h1 className='m-0'>§{channelName}</h1>
        </div>
        
        <Feed channelName={channelName} />
    </div>
  );
};

export default ChannelPage;