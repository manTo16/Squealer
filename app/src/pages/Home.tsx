import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SidebarComponent from '@components/Sidebar/SidebarComponent';
import Searchbar from '@components/Searchbar/Searchbar';
import Feed from '@components/Feed/Feed';
import SidebarContent from '@components/Sidebar/SidebarContent';
import ThirdColumn from '@components/ThirdColumn/ThirdColumn';

import "./Home.css";
import UserInfo from '@components/UserInfo';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div className="full-height home">
        <Feed channelName='ALL'/>
    </div>
  );
}
