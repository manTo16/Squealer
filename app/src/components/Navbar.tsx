import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import Logo from '../assets/Squealer.png'
import { NavLink, useNavigate } from 'react-router-dom';
import Bell from './Button/BellButton'
import Logout from './Button/LogoutButton';
import SearchLogo from './Button/SearchLogo';
import "./Navbar.scss"

/* sidebar */
import SidebarComponent from './Sidebar/SidebarComponent';


export default function Navbar() {
  // const isLoggedIn = !!localStorage.getItem('token')
  const isLoggedIn = true
  const navigate = useNavigate()

  const handleLogout = (e:React.MouseEvent<HTMLElement>) => {
    localStorage.removeItem('token')
    navigate('/')
  }
  console.log(isLoggedIn)
  return (
    <NavbarBootstrap expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid">
      <ContainerBootstrap>

      <NavbarBootstrap.Brand to="/" as={NavLink} className="d-flex align-items-center">
        <SidebarComponent />
        <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-top mx-2" />
        <span className='Logo'>Squealer </span>
      </NavbarBootstrap.Brand>

      <div className="searchBar">
        <SearchLogo className='searchIcon'/>
        <input
            placeholder='Trova amici, post o video'
            className='searchInput'
        />
      </div>

      <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
      <NavbarBootstrap.Collapse id="basic-navbar-nav">
          {!isLoggedIn ?(
              // if NOT logged
              <NavBootstrap className="ms-auto">
                <NavBootstrap.Link to="/login" as={NavLink}>Log in</NavBootstrap.Link>
                <NavBootstrap.Link to="/register" as={NavLink}>Register</NavBootstrap.Link>
              </NavBootstrap>
            ):(
              // if logged
              <NavBootstrap className="ms-auto">
                <div className="Bell"><Bell/></div>
                <div className="Logout"><Logout/></div>
                <img src="/assets/person/1.png" alt="" className='navbarImg'/>
              </NavBootstrap>
            )
          }

        </NavbarBootstrap.Collapse>
      </ContainerBootstrap>
    </NavbarBootstrap>
  );
}