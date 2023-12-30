import Video from "../components/svg/VideoSvg";
import LocationButton from "../components/svg/LocationSvg";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import CardFooter from 'react-bootstrap/CardFooter'
import Container from 'react-bootstrap/Container'
import Media from "../components/svg/MediaSvg";
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Textarea } from "flowbite-react";
import { text } from "stream/consumers";
import axios from 'axios'
import { apiPostsURL } from "../URLs";
import { useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";

export default function NewPostPage() {
    const defaultValue = {}
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
    const userToken = localStorage.getItem("token") ?? "";
    
    var Dchar = 1024;

    const [text,setText] = useState("");
    const [receiver, setReceiver] = useState("");

    const [charCount, setCharCount] = useState(0);

    const [textLines, setTextLines] = useState(1);

    const calculateNumberOfTextLines = (textarea: HTMLElement) => {
        return Math.floor(textarea.scrollHeight/parseInt(getComputedStyle(textarea).lineHeight) );
    }

    const navigate = useNavigate()

    //calcola le linee da assegnare al componente ponendoci un limite, impostato in modo che la textarea non occupi più di metà schermo
    const getTextLines = (textarea: HTMLTextAreaElement) => {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        //const maxHeight = textarea.parentElement?.clientHeight;  //non funziona, il componente cardbody si allunga dinamicamente
        const maxHeight = window.innerHeight / 2
        
        const maxLines = Math.floor(maxHeight / lineHeight);
        
        const lines = calculateNumberOfTextLines(textarea);
        return Math.min(lines, maxLines);
    }
    
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = event.target.value;
        setCharCount(inputText.length);
        setText(inputText)
        setTextLines(getTextLines(event.target));
    };

    const handleReceiverInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value;
        setReceiver(inputText);
    }

    const handleSubmit = async (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        console.log('sei qui')
        try{
            const response = await axios.post(apiPostsURL,
                {userId: userDetails._id,text, receiver},
                { headers: {"Authorization": `Bearer ${userToken}`}}
                )
            console.log('ora sei quiaaaa')
            alert('Post created')
            navigate('/')
            window.location.reload();
        }
        catch(err){
            console.log(err)
        }
    }


    return(
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} g={{ span: 6, offset: 3 }}>
                    <Card bg='dark' text='white'>
                        <Card.Header>
                        <div className="tags">
                            <Stack direction="horizontal" gap={2}>
                                {/* <img className="shareProfileImg" src={propic} alt="" /> */}
                                <span className="p-2 displayedName">Repubblica</span>
                                <span className="p-2 tagName">@Repubblica</span>
                                <span className="p-2 ms-auto charLeft">{charCount}</span>
                            </Stack>
                        </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <span className="text-secondary">@</span>
                                <input className="receiverInput bg-dark text-white"
                                placeholder="Destinatario" 
                                type="text"
                                onChange={handleReceiverInputChange} />
                            </Card.Text>
                            <Card.Text>
                            <textarea
                                placeholder="Squillo calde nei paraggi"
                                className="shareInput bg-dark text-white"
                                rows={textLines}
                                cols={0}     //viene sostituita da width quindi il valore qua non viene guardato
                                maxLength={Dchar}               // sostituire coi caratteri giornalieri
                                onChange={handleInputChange}    // visualizza quanti caratteri sono stati inseriti
                                style={{width:"100%"}}
                            />
                            </Card.Text>
                            <CardFooter>
                                <Stack direction="horizontal" gap={3}>
                                    <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                                        <ToggleButton className="btn btn-outline-light border-primary" id="postType-Img" value={2}><Media/></ToggleButton>
                                        <ToggleButton className="btn btn-outline-light border-primary" id="postType-vid" value={3}><Video/></ToggleButton>
                                        <ToggleButton className="btn btn-outline-light border-primary" id="postType-gps" value={4}><LocationButton/></ToggleButton>
                                    </ToggleButtonGroup>

                                    <Button className="p-2 ms-auto">Squeal</Button>
                                </Stack>
                            </CardFooter>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}