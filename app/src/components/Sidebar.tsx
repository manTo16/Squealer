import React from 'react'
import Nav from 'react-bootstrap/Nav'


export default function Sidebar() {
  return (
    <div>
      <Nav className='sidebar d-flex flex-column'>
        <Nav.Item>
          Channel1
        </Nav.Item>
        <Nav.Item>
          Channel2
        </Nav.Item>
        <Nav.Item>
          Channel3
        </Nav.Item>
        <Nav.Item>
          Channel4
        </Nav.Item>
      </Nav>
    </div>
  )
}
