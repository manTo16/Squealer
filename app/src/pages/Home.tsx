
import Feed from '@components/Feed/Feed';

import "./Home.css";
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserDetailsInterface } from '@utils/userData';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token')

  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      if (userDetails.username) {
          setIsLoading(false);
      }
  }, [userDetails])

  if(!isLoggedIn) return (
    <Feed channelName='ALL'/>
  )

  if (isLoading) return <p>loading...</p>


  return (
    <div className="home">
        <Feed personalFeed={true} userName={userDetails.username} />
    </div>
  );
}
