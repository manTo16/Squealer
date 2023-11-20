import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import SidebarComponent from '../components/SidebarComponent'
import Searchbar from '../components/Searchbar'
import Post from '../components/Post'

import "./Home.css"



export default function Home() {
  return (
    <div>
      <Container className='h-100'>
        
        <Row xs={12} className="main-row">

          <Col xs={2} className='sidebar-wrapper'>
            
          </Col>

          <Col xs={6} className='content-wrapper'>
          <Post username="username1" />
          <Post username="lala" />
          <Post username="io" />
          </Col>

          <Col xs={4} className='right-column-wrapper'>
            <p>terza colonna</p>
          </Col>
         
        </Row>
      </Container>
    </div>
  )
}
