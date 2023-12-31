import Video from "../components/svg/VideoSvg";
import LocationButton from "../components/svg/LocationSvg";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ReceiverInputField from "@components/newPost/ReceiverInputField";
import CardFooter from 'react-bootstrap/CardFooter'
import Container from 'react-bootstrap/Container'
import Media from "../components/svg/MediaSvg";
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
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
    const [receivers, setReceivers] = useState<string[]>([""]);
    const [nReceivers, setNReceivers] = useState(1);

    const [charCount, setCharCount] = useState(0);

    const [textLines, setTextLines] = useState(1);

    const calculateNumberOfTextLines = (textarea: HTMLElement) => {
        return Math.floor(textarea.scrollHeight/parseInt(getComputedStyle(textarea).lineHeight) );
    }

    const navigate = useNavigate()

    useEffect(() => {
        //if not logged in, redirects to login page
        if(!userToken) {
            navigate("/login");
        }
    }, [])

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

    const handleReceiverInputChange = (event: React.ChangeEvent<HTMLInputElement>, receiversArrayIndex: number) => {
        const inputText = event.target.value;
        
        /* aggiorna l'array di destinatari modificando solo l'indice corrispondente al campo modificato */
        setReceivers(receivers => receivers.map((receiver, index) =>
            index == receiversArrayIndex-1 ? inputText : receiver));
    }

    const handleSubmit = async (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        console.log('sei qui')
        try{
            const response = await axios.post(apiPostsURL,
                {userId: userDetails._id,text, receivers},
                { headers: {"Authorization": `Bearer ${userToken}`}}
                ).then(()=>{
                    console.log('ora sei quiaaaa')
                    alert('Post created')
                    navigate('/')
                })
            //window.location.reload();
        }
        catch(err){
            console.log(err)
        }
    }

    const handleAddReceivers = () => {
        if (nReceivers<=100) {
            setNReceivers(nReceivers+1);
            setReceivers((prev) => [...prev, ""])
        }
        console.log(receivers)
    }

    const handleRemoveReceivers = () => {
        if (nReceivers>0){
            setNReceivers(nReceivers-1);
            setReceivers(receivers.slice(0, -1))
        }
        console.log(receivers)
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
                            <Card.Title>Squillami tutto</Card.Title>

                            <Card.Text>
                                Destinatari: {nReceivers}
                                <Button 
                                variant="outline-light"
                                disabled={nReceivers>100}
                                onClick={handleAddReceivers}>
                                    +1
                                </Button>
                                <Button
                                variant="outline-light"
                                disabled={nReceivers<1}
                                onClick={handleRemoveReceivers}>
                                    -1
                                </Button>
                            </Card.Text>

                            {[...Array(nReceivers)].map((_, i) => (
                                <ReceiverInputField key={i} 
                                _inputField={i + 1} 
                                handleReceiverInputChange={handleReceiverInputChange} 
                                />
                            ))}

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
                                        <ToggleButton className="btn btn-dark border-light" id="postType-Img" value={2}><Media/></ToggleButton>
                                        <ToggleButton className="btn btn-dark border-light" id="postType-vid" value={3}><Video/></ToggleButton>
                                        <ToggleButton className="btn btn-dark border-light" id="postType-gps" value={4}><LocationButton/></ToggleButton>
                                    </ToggleButtonGroup>

                                    <Button 
                                    className="p-2 ms-auto btn-dark border-light"
                                    onClick={handleSubmit}>
                                        Squeal</Button>
                                </Stack>
                            </CardFooter>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
    

    
}