import { Link, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useContext, useRef, useState } from 'react';
import ContainerBootstrap from 'react-bootstrap/Container';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import SidebarComponent from './Sidebar/SidebarComponent';
import Searchbar from './Searchbar/Searchbar';
import Logo from '../assets/Squealer.png'
import { Badge, Col, Nav, Row } from 'react-bootstrap';
import WeeklyCalendar from './svg/CharSvg/wCharSvg';
import { UserContext } from '@utils/userData';
import MonthlyCalendar from './svg/CharSvg/mCharSvg';
import DailyCalendar from './svg/CharSvg/dCharSvg';
import { checkIfInDebt } from "@utils/debt";

import { UserDetailsInterface } from '@utils/userData';


export default function Navbar(
  {onHeightChange} : {onHeightChange: (height: number) => void}
) {
  window.addEventListener("resize", () => onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0))

  const isLoggedIn = !!localStorage.getItem('token')
  const [userInDebt, setUserInDebt] = useState(false)
  const location = useLocation()
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }

  const divHtmlElementRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const fetchDebt = async () => {
    isLoggedIn && userDetails.username && setUserInDebt(await checkIfInDebt(userDetails.username))
  }

  useEffect(() => {
    onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0)
    console.log("navbar divHtmlElementRef.current?.clientHeight: ", divHtmlElementRef.current?.clientHeight)
  }, [onHeightChange])

  useEffect(() => {
    fetchDebt();
  }, [10000])


  console.log('isLoggedIn?: ', isLoggedIn)
  return (
    <div ref={divHtmlElementRef}>
      <NavbarBootstrap expand="lg" className="p-0 navbar-expand-lg navbar-dark bg-dark container-fluid pb-2">
        <ContainerBootstrap>

          <NavbarBootstrap.Brand className="d-flex align-items-center">
            <SidebarComponent />
            <Link to="/" style={{ textDecoration: 'none' }} className="align-middle">
              <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-middle mx-2" />
              <span className='ms-1 text-white fw-bold fs-3'>Squealer</span>
            </Link>
          </NavbarBootstrap.Brand>
          <Searchbar />
        </ContainerBootstrap>
      </NavbarBootstrap>

    {
      location.pathname !== '/charShop' && location.pathname !== '/profile' && !!isLoggedIn && !userInDebt ? (
        <NavbarBootstrap expand="sm" className='d-lg-none navbar-dark bg-dark d-flex justify-content-center align-items-center pb-0'>
            <div className='d-flex flex-column justify-content-center'>
              <DailyCalendar/>
              <h3>
                <Badge pill bg="secondary">
                  {userDetails.dailyChar}
                </Badge>
              </h3>
            </div>
              <div className="vr mx-3" />
            <div className='d-flex flex-column'>
              <WeeklyCalendar/>
              <h3>
                <Badge pill bg="secondary">
                  {userDetails.weeklyChar}
                </Badge>
              </h3>
            </div>
              <div className="vr mx-3" />
            <div className='d-flex flex-column'>
              <MonthlyCalendar/>
              <h3>
                <Badge pill bg="secondary">
                  {userDetails.monthlyChar}
                </Badge>
              </h3>
            </div>
        </NavbarBootstrap>
      ) : userInDebt ? (
        <>
          <NavbarBootstrap 
            expand="sm" 
            className='d-lg-none navbar-dark bg-dark d-flex justify-content-center align-items-center pb-2'>
            <Button 
              variant="warning"
              onClick={() => navigate("/charShop")}
            >
              Sei in debito, non potrai scrivere fino a domani
            </Button>
          </NavbarBootstrap>
        </>
      ) : (
        <></>
      )
    }
    </div>
  );
}