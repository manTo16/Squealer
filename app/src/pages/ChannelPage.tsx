
import React from 'react';
import { useParams } from 'react-router-dom';

const ChannelPage: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();


  return (
    <div>
        {channelName}
      {/* Visualizza i dati del canale qui */}
    </div>
  );
};

export default ChannelPage;