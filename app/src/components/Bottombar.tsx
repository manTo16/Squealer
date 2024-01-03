import { useEffect, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

import "./Bottombar.css"

import HomeButton from './svg/BottomBarSvg/HomeButton';
import FireButton from './svg/BottomBarSvg/FireButton';
import AddButton from './svg/BottomBarSvg/AddButton';
import QuestionButton from './svg/BottomBarSvg/QuestionButton';
import GroupButton from './svg/BottomBarSvg/GroupButton';



/*
icone:
https://reactsvgicons.com/materialdesignicons?page=1
*/

export default function Bottombar(
  {onHeightChange}: {onHeightChange: (height: number) => void}
) {
  window.addEventListener("resize", () => onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0))

  const divHtmlElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onHeightChange(divHtmlElementRef.current?.clientHeight ?? 0)
    
    console.log("bottombar divHtmlElementRef.current?.clientHeight: ", divHtmlElementRef.current?.clientHeight)  //DEBUG
  }, [onHeightChange])


  return (
    <div ref={divHtmlElementRef}>

    <Navbar fixed="bottom" bg="dark" data-bs-theme="dark" className="bottom-navbar">
      <Nav className="d-flex flex-grow-1"> 
        <Container className='justify-content-center ca'>
            <Row>

            <Col>
              <Nav.Item>
                  <Button variant="outline-light" href="/" className='btn-transparent'>
                    <HomeButton />
                  </Button>
              </Nav.Item>
            </Col>
    
            <Col>
              <Nav.Item>
                <Button variant="outline-light" href="/trendingPage" className='btn-transparent'>
                  <FireButton/>
                </Button>
              </Nav.Item>
            </Col>

            <Col>
              <Nav.Item>
                <Button variant="outline-light" href="/newPost" className='btn-transparent'>
                  <AddButton />
                </Button>
              </Nav.Item>
            </Col>

            <Col>
              <Nav.Item>
                <Button variant="outline-light" className='btn-transparent'>
                  <QuestionButton/>
                </Button>
              </Nav.Item>
            </Col>

            <Col>
              <Nav.Item>
                <Button variant="outline-light" className='btn-transparent'>
                  <GroupButton/> 
                </Button>
              </Nav.Item>
            </Col>

            </Row>
        </Container>
      </Nav>
    </Navbar>
  
    </div>

  );
}