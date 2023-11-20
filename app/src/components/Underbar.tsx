import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import "./Underbar.css"

import Logo from "../assets/Squealer.png"

function Underbar() {
  return (
    <>
      <Navbar fixed="bottom" bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Item className="underbar-button">
                <Button variant="outline-light">
                    <img src={Logo} alt="home-button" height="100%" width="100%" />
                </Button>
            </Nav.Item>
            <Nav.Item className="underbar-button">
                <Button variant="outline-*">
                    <img src={Logo} alt="fire-button" height="100%" width="100%" />
                </Button>
            </Nav.Item>
            <Nav.Item className="underbar-button">
                <Button variant="outline-primary">
                    <img src={Logo} alt="plus-button" height="100%" width="100%" />
                </Button>
            </Nav.Item>
            <Nav.Item className="underbar-button">
                <Button variant="outline-secondary">
                    <img src={Logo} alt="lol" height="100%" width="100%" />
                </Button>
            </Nav.Item>
            <Nav.Item className="underbar-button">
                <Button variant="primary">
                    <img src={Logo} alt="chat-button" height="100%" width="100%" />
                </Button>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Underbar;