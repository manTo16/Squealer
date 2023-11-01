import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/col'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Container className='h-100'>
        <Row>
          <Col xs={2} className='sidebar-wrapper'>
            <Sidebar />
          </Col>
          <Col xs={6} className='content-wrapper'></Col>
          <Col xs={4} className=''></Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  )
}
