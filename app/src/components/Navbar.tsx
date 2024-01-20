import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import ContainerBootstrap from 'react-bootstrap/Container';
import NavbarBootstrap from 'react-bootstrap/Navbar';

import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar/Searchbar';

import ProfileLG from './Profile options/ProfileLG';
import ProfileSM from './Profile options/ProfileSM';
import Logo from '../assets/Squealer.png'



export default function Navbar(
  {onHeightChange} : {onHeightChange: (height: number) => void}
) {
  window.addEventListener("resize", () => onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0))

  const isLoggedIn = !!localStorage.getItem('token')
  // const isLoggedIn = true

  const divHtmlElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0)
    console.log("navbar divHtmlElementRef.current?.clientHeight: ", divHtmlElementRef.current?.clientHeight)
  }, [onHeightChange])


  console.log(isLoggedIn)
  return (
    <div ref={divHtmlElementRef}>

    <NavbarBootstrap expand="lg" className="p-0 navbar-expand-lg navbar-dark bg-dark container-fluid mb-2">
      <ContainerBootstrap>

        <NavbarBootstrap.Brand className="d-flex align-items-center">
          <SidebarComponent />
          <Link to="/" style={{ textDecoration: 'none' }} className="align-middle">
          <a style={{ textDecoration: 'none' }} className="align-middle" href="/">
            <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-middle mx-2" />
            <span className='ms-1 text-white fw-bold fs-3'>Squealer</span>
          </a>
          </Link>
        </NavbarBootstrap.Brand>
        <Searchbar />
      </ContainerBootstrap>
    </NavbarBootstrap>

    </div>
  );
}