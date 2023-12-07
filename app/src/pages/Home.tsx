import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import SidebarComponent from '../components/Sidebar/SidebarComponent'
import Searchbar from '../components/Searchbar/Searchbar'
import Feed from '../components/Feed/Feed'
import SidebarContent from '../components/Sidebar/SidebarContent'
import ThirdColumn from '../components/ThirdColumn/ThirdColumn'

import "./Home.css"
import UserInfo from '../components/UserInfo'



export default function Home() {
  return (
    <div>
      <Container fluid>
        
        <Row xs={12} lg={12} className="main-row">

          <Col xs={0} lg={{ span: 2, offset: 1 }} className='d-none d-lg-block'>
            <SidebarContent />
          </Col>

          <Col xs={12} lg={6} className='content-wrapper'>
            <Feed/>
          </Col>

          <Col xs={0} lg={4} className='right-column-wrapper'>
            {/* <UserInfo /> */}
          </Col>
        
        </Row>
      </Container>
    </div>
  )
}
