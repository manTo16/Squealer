import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import "./Bottombar.css"

import Logo from "../assets/Squealer.png"
import HomeButton from './Button/BottomBarButtons/HomeButton';
import FireButton from './Button/BottomBarButtons/FireButton';
import AddButton from './Button/BottomBarButtons/AddButton';
import QuestionButton from './Button/BottomBarButtons/QuestionButton';
import GroupButton from './Button/BottomBarButtons/GroupButton';

import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';


/*
icone:
https://reactsvgicons.com/materialdesignicons?page=1
*/
import "./Bottombar.css"

export default function Bottombar() {
  return (
      <Navbar fixed="bottom" bg="dark" data-bs-theme="dark">
        <Nav className="d-flex justify-content-around">  {/*AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA*/}
          <Container>
              <Row>
                <Col>
                  <Nav.Item className='d-flex justify-content-around'>
                      <Button variant="outline-light">
                        <HomeButton />
                      </Button>
                  </Nav.Item>
                </Col>
        
                <Col>
                  <Nav.Item className='d-flex justify-content-around'>
                    <Button variant="outline-light">
                      <FireButton/>
                    </Button>
                  </Nav.Item>
                </Col>

                <Col className='justify-content-start'>
                  <Nav.Item className='d-flex justify-content-around'>
                    <Button variant="outline-light" href="/newPost">
                      <AddButton />
                    </Button>
                  </Nav.Item>
                </Col>

                <Col>
                  <Nav.Item className='d-flex justify-content-around'>
                    <Button variant="outline-light">
                      <QuestionButton/>
                    </Button>
                  </Nav.Item>
                </Col>

                <Col>
                  <Nav.Item className='d-flex justify-content-around'>
                    <Button variant="outline-light">
                      <GroupButton/> 
                    </Button>
                  </Nav.Item>
                </Col>
              </Row>
          </Container>
        </Nav>
      </Navbar>
  );
}