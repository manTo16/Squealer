import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../assets/Squealer.png'
import { NavLink, useNavigate } from 'react-router-dom';
import Bell from './svg/BellSvg'
import Logout from './svg/LogoutSvg';
import "./Navbar.scss"


import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar/Searchbar';

var Dchar = 69;
var Wchar = 104;
var Mchar = 420;

// quando è sm mette sotto la searchbar
// quando è lg mostra la sidebar e toglie il bottone

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token')
  // const isLoggedIn = true
  const navigate = useNavigate()

  const handleLogout = (e:React.MouseEvent<HTMLElement>) => {
    localStorage.removeItem('token')
    navigate('/')
  }
  console.log(isLoggedIn)
  return (
    
    <NavbarBootstrap expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid">
      <ContainerBootstrap>

        <NavbarBootstrap.Brand className="d-flex align-items-center">
          <SidebarComponent />
          <a style={{ textDecoration: 'none' }} href="/">
            <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-top mx-2" />
            <span className='Logo'>Squealer</span>
          </a>
        </NavbarBootstrap.Brand>
        
        <NavDropdown 
            align="end"
            title="Caratteri"
            id="collapsible-nav-dropdown"
            style={{ padding: '10px' }}
          >

          <NavDropdown.ItemText>Daily: {Dchar}</NavDropdown.ItemText>
          <NavDropdown.ItemText>Weekly: {Wchar}</NavDropdown.ItemText>
          <NavDropdown.ItemText>Monthly: {Mchar}</NavDropdown.ItemText>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Buy some more</NavDropdown.Item>
        </NavDropdown>
        
        <Searchbar />
      
      </ContainerBootstrap>
    </NavbarBootstrap>
  );
}