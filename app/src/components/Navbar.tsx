import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import Logo from '../assets/squealer-logo.png'
import { NavLink } from 'react-router-dom';


export default function Navbar() {
  return (
    <NavbarBootstrap expand="lg" className="bg-white shadow-sm">
      <ContainerBootstrap>
        <NavbarBootstrap.Brand to="/" as={NavLink}>
          <img src={Logo} alt="" width="50" height="30" className="d-inline-block align-top mx-2"/>
          Squealer</NavbarBootstrap.Brand>
        <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBootstrap.Collapse id="basic-navbar-nav">
          <NavBootstrap className="ms-auto">
            <NavBootstrap.Link to="/login" as={NavLink}>Log in</NavBootstrap.Link>
            <NavBootstrap.Link to="/register" as={NavLink}>Register</NavBootstrap.Link>
          </NavBootstrap>
        </NavbarBootstrap.Collapse>
      </ContainerBootstrap>
    </NavbarBootstrap>
  );
}
