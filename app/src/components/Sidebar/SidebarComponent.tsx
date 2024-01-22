
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import SidebarContent from './SidebarContent';

function SidebarComponent() {
  const [show, setShow] = useState(false);


  return (
    <>
      <Button onClick={() => setShow(true)} variant='success' className='rounded d-lg-none'>
        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
              width="24" height="24"  fill="currentColor" 
              stroke="currentColor"   strokeWidth="1" 
              strokeLinecap="round"  strokeLinejoin="round">
            <path d="M0 0h24v3H0zm0 8h24v3H0zm0 8h24v3H0z"/>
        </svg>
      </Button>

      <Offcanvas className="offcanvas-background bg-dark" show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton closeVariant='white' className='pb-0'>
          <Offcanvas.Title className='normal-text'><h1>Canali</h1></Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body className='p-0'>
          <SidebarContent handleShow={setShow}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SidebarComponent;