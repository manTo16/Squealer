import FeelingsButton from "../components/svg/FeelingsSvg";
import LocationButton from "../components/svg/LocationSvg";
import CardFooter from 'react-bootstrap/CardFooter'
import Container from 'react-bootstrap/Container'
import TagButton from "../components/svg/TagSvg";
// import propic from "../../assets/person/1.png"
import Media from "../components/svg/MediaSvg";
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



export default function NewPostPage() {

    var Dchar = 1024;

    var Msg;

    const [charCount, setCharCount] = useState(0);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = event.target.value;
        setCharCount(inputText.length);
    };

    return(
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} g={{ span: 6, offset: 3 }}>
                    <Card bg='dark' text='white'>
                        <Card.Header>
                        <div className="tags">
                            {/* <img className="shareProfileImg" src={propic} alt="" /> */}
                            <span className="displayedName">Repubblica</span>
                            <span className="tagName">@Repubblica</span>
                            <span className="charLeft">{charCount}</span>
                        </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Squillami tutto</Card.Title>
                            <Card.Text>
                            <textarea
                                placeholder="Squillo calde nei paraggi"
                                className="shareInput"
                                rows={4}
                                cols={50}
                                maxLength={Dchar}               // sostituire coi caratteri giornalieri
                                onChange={handleInputChange}    // visualizza quanti caratteri sono stati inseriti
                            />
                            </Card.Text>
                            <CardFooter>
                                <Button className='btn-transparent d-lg-none'>
                                    <Media/>
                                </Button>
                                <Button className='btn-transparent d-lg-none'>
                                    <TagButton/>
                                </Button>
                                <Button className='btn-transparent d-lg-none'>
                                    <LocationButton/>
                                </Button>
                                <Button className='btn-transparent d-lg-none'>
                                    <FeelingsButton/>
                                </Button>
                                <Button className='btn-transparent d-lg-none'>
                                    Post
                                </Button>
                            </CardFooter>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}