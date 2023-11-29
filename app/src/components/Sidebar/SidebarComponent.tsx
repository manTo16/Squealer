
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import SidebarContent from './SidebarContent';

import "./SidebarComponent.css";

function SidebarComponent() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='d-lg-none'>
      <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
            width="24" height="24"  fill="currentColor" 
            stroke="currentColor"   stroke-width="1" 
            stroke-linecap="round"  stroke-linejoin="round">
          <path d="M0 0h24v3H0zm0 8h24v3H0zm0 8h24v3H0z"/>
        </svg>
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cacca</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SidebarComponent;