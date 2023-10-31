import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/col'

export default function Home() {
  return (
    <div>
      <Container className='h-100'>
        <Row>
          <Col></Col>
          <Col xs={6} className='bg-dark'></Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  )
}
