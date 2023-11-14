import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import SidebarComponent from '../components/Header/SidebarComponent.js'
import Searchbar from '../components/Searchbar.js'



export default function Home() {
  return (
    <div>
      <Container className='h-100'>
        <Row>
          <Col xs={3} className='searchbar/wrapper'>
            <Searchbar />
          </Col>
        </Row>
        
        <Row>
          <Col xs={2} className='sidebar-wrapper'>
            <SidebarComponent />
          </Col>

          <Col xs={6} className='content-wrapper'></Col>
          <Col xs={4} className=''></Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  )
}
