import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Searchbar from '../Searchbar';


export default function SidebarContent() {
    return(
    <div>
        <Searchbar />

        <Button variant="outline-light" href="/login">
          Log in
        </Button>
        <Button variant="outline-light" href="/register">
          Register
        </Button>


        <h3 className="sidebar-title">Canali consigliati</h3>
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