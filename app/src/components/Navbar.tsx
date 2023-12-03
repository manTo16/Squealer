import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import Logo from '../assets/Squealer.png'
import { NavLink, useNavigate } from 'react-router-dom';
import Bell from './svg/BellSvg'
import Logout from './svg/LogoutSvg';
import "./Navbar.scss"


import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar';


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
        <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-top mx-2" />
        <span className='Logo'>Squealer</span>
      </NavbarBootstrap.Brand>

      <Searchbar />
      
      </ContainerBootstrap>
    </NavbarBootstrap>
  );
}