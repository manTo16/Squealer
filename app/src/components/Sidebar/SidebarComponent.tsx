
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
      <Button onClick={handleShow} className='btn-transparent d-lg-none'>
        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
              width="24" height="24"  fill="currentColor" 
              stroke="currentColor"   strokeWidth="1" 
              strokeLinecap="round"  strokeLinejoin="round">
            <path d="M0 0h24v3H0zm0 8h24v3H0zm0 8h24v3H0z"/>
        </svg>
      </Button>

      <Offcanvas className="offcanvas-background" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton closeVariant='white'>
          <Offcanvas.Title className='normal-text'>Cacca</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SidebarComponent;