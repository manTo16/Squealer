
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { channelsURL } from '../URLs';

import Feed from '@components/Feed/Feed';

const ChannelPage: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();

  return (
    <div>
        {channelName}
        <Feed channelName={channelName} />
      {/* Visualizza i dati del canale qui */}
    </div>
  );
};

export default ChannelPage;