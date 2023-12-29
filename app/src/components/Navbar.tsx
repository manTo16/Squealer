import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import DropdownCharSM from './Char indicator/DropdownChar4SM';
import DropdownCharLG from './Char indicator/Char4LGscreen';
import Logo from '../assets/Squealer.png'
import ProfileLG from './Profile options/ProfileLG';
import ProfileSM from './Profile options/ProfileSM';
import { NavLink, useNavigate } from 'react-router-dom';
import Bell from './svg/BellSvg'
import Logout from './svg/LogoutSvg';
import "./Navbar.scss"


import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar/Searchbar';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token')
  // const isLoggedIn = true
  const navigate = useNavigate()


  console.log(isLoggedIn)
  return (
    
    <NavbarBootstrap expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid mb-2">
      <ContainerBootstrap>

        <NavbarBootstrap.Brand className="d-flex align-items-center">
          <SidebarComponent />
          <a style={{ textDecoration: 'none' }} className="align-middle" href="/">
            <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-middle mx-2" />
            <span className='Logo'>Squealer</span>
          </a>
        </NavbarBootstrap.Brand>
        <DropdownCharSM />
        <ProfileSM/>
        <Searchbar />
        <DropdownCharLG />
        <ProfileLG />
      </ContainerBootstrap>
    </NavbarBootstrap>
  );
}