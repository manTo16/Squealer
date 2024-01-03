import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import "./Navbar.scss"

import ContainerBootstrap from 'react-bootstrap/Container';
import NavBootstrap from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';

import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar/Searchbar';

import DropdownCharSM from './Char indicator/DropdownChar4SM';
import DropdownCharLG from './Char indicator/Char4LGscreen';
import ProfileLG from './Profile options/ProfileLG';
import ProfileSM from './Profile options/ProfileSM';
import Bell from './svg/BellSvg'
import Logout from './svg/LogoutSvg';
import Logo from '../assets/Squealer.png'



export default function Navbar(
  {onHeightChange} : {onHeightChange: (height: number) => void}
) {
  window.addEventListener("resize", () => onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0))

  const isLoggedIn = !!localStorage.getItem('token')
  // const isLoggedIn = true
  const navigate = useNavigate()

  const divHtmlElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0)
    console.log("navbar divHtmlElementRef.current?.clientHeight: ", divHtmlElementRef.current?.clientHeight)
  }, [onHeightChange])


  console.log(isLoggedIn)
  return (
<<<<<<< HEAD
    
    <NavbarBootstrap expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid">
=======
    <div ref={divHtmlElementRef}>

    <NavbarBootstrap expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid mb-2">
>>>>>>> 84353e93ce9653a8bd604519a5c2e27cfae627fb
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

    </div>
  );
}