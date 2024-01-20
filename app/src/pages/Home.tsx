
import Feed from '@components/Feed/Feed';

import "./Home.css";

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div className="home">
        <Feed channelName='ALL'/>
    </div>
  );
}
