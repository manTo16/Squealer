
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { channelsURL } from '../URLs';

const ChannelPage: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();

  useEffect(() => {
    const loadChannelPosts = async () => {
      const response = await axios.get(channelsURL+"/"+channelName);
    }
    loadChannelPosts()
  }, [])


  return (
    <div>
        {channelName}
      {/* Visualizza i dati del canale qui */}
    </div>
  );
};

export default ChannelPage;