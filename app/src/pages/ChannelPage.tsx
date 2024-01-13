
import { useParams } from 'react-router-dom';
import axios from '@root/axiosConfig';

import { channelsURL } from '../URLs';

import Feed from '@components/Feed/Feed';

const ChannelPage: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();

  /*
  cambiando pagina con useNavigate, se passi da una pagina che renderizza questo componente
  a una che renderizza sempre questo componente
  (tipo da /channels/canale1 a /channels/canale2)
  react non fa il secondo rendering del componente, quindi bisogna aggiungere nelle cose che si vogliono
  modificare uno useEffect col parametro dell'url. 

  in questo caso l'ho messo nel Feed
  */

  return (
    <div>
        <h1>{channelName}</h1> {/* alla grafica del titolo poi ci lavoriamo */}
        <Feed channelName={channelName} />
      {/* Visualizza i dati del canale qui */}
    </div>
  );
};

export default ChannelPage;