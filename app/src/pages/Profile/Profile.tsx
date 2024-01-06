import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@root/axiosConfig';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Gear from '@components/svg/GearSvg';
import Card from 'react-bootstrap/Card';

import SidebarContent from '@components/Sidebar/SidebarContent';
import Feed from '@components/Feed/Feed';
import Channels from '@components/svg/ChannelSvg';
import User from '@components/svg/User';
import ProfileSide from './ProfileSide';

// const ProfilePage: React.FC = () => {
//   const { profileName } = useParams<{ profileName: string }>();

export default function ProfilePage (){
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

  const[side, setSide] = useState('profile');

  const handleSide = (eventKey: string | null) => {
    if (eventKey === null) return;
    setSide(eventKey);
  };

  return (
    <>
      <Container fluid className="p-0 rounded full-height home">
        <Nav fill variant="underline" className='px-5 navbar-dark bg-dark' defaultActiveKey={"Profile"}>
          <Nav.Item>
            <Nav.Link eventKey={"Profile"} className='text-light' onClick={()=>handleSide('profile')}>
              <User/>
              <span className='px-2 d-none d-md-block'>Profile</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"Channels"} className='text-light' onClick={()=>handleSide('channels')}>
              <Channels/>
              <span className='px-2 d-none d-md-block'>Channels</span>  
              </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"Options"} className='text-light' onClick={()=>handleSide('options')}>
              <Gear/>
              <span className='px-2 d-none d-md-block'>Options</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Row className='p-2'>
          <ProfileSide 
              type={side}/>
        </Row>
      </Container>
    </>
  );
};

// export default ProfilePage;