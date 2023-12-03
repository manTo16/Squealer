import Button from 'react-bootstrap/Button';

import Bell from '../svg/BellSvg';
import Logout from '../svg/LogoutSvg';
import Searchbar from '../Searchbar';


export default function SidebarContent() {
  const isLoggedIn = true;

  return(
  <div>
      <div className='sidebar-separator mt-4'>
        <Searchbar />
      </div>

      {
        isLoggedIn ? 
        (
        <div className='logged-in-buttons'>
          <div className="Bell"><Bell/></div>
          <div className="Logout"><Logout/></div>
          <img src="/assets/person/1.png" alt="" className='navbarImg'/>
        </div>
        ) :
        (
        <div className='logged-out-buttons'>
          <Button variant="outline-light" href="/login">
            Log in
          </Button>
          <Button variant="outline-light" href="/register">
            Register
          </Button>
        </div>
        )
      }

      <h3 className="normal-text">Canali consigliati</h3>
      <div className="channels-wrapper">
        <Button variant="outline-light">
          canale 1
        </Button>
        <Button variant="outline-light">
          canale 2
        </Button>
        <Button variant="outline-light">
          canale x
        </Button>
        <Button variant="outline-light">
          cronologia
        </Button>
      </div>
  </div>
  )
}