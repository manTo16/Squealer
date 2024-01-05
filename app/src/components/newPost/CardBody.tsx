import React, { useState, ChangeEvent } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TestGeolocation from '@components/Geolocation/Geolocation';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import IconPaste from '@components/svg/PasteSvg';
import IconUpload from '@components/svg/UploadSvg';
import IconCamera from '@components/svg/CameraSvg';

interface CardBodyProps {
    type: string;
    onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; // Usa onInputChange invece di handleInputChange
    charCount: number;
    textLines: number;
    Dchar: number;
}

export default function CardBody({
    type,
    onInputChange,
    charCount,
    textLines,
    Dchar
}: CardBodyProps) {
    const [inputValue, setInputValue] = useState<string>(''); // Specifica il tipo string per inputValue

    const[MediaType, setMediaType] = useState('paste');

    const handleMediaType = (eventKey: string | null) => {
        if (eventKey === null) return;
        setMediaType(eventKey);
        console.log(MediaType);
      };

    // const [charCount, setCharCount] = useState(0);

    if (type === 'txt') {
        return (
            <>
            <Form.Label>Scrivi il tuo squal</Form.Label>
            <InputGroup>
                <InputGroup.Text>{charCount}</InputGroup.Text>
                <Form.Control 
                    as="textarea" 
                    aria-label="With textarea" 
                    className="shareInput bg-dark text-white"
                    placeholder="Squillo calde nei paraggi"
                    onChange={onInputChange}
                    rows={textLines}
                    maxLength={Dchar}
                />
            </InputGroup>
            </>
        );
    } else if (type === 'img') {
        return (
            <>
            <ButtonGroup aria-label="Basic example">
                <Button variant="secondary" onClick={() => handleMediaType('paste')}><IconPaste/></Button>
                <Button variant="secondary" onClick={() => handleMediaType('upload')}><IconUpload/></Button>
                <Button variant="secondary" onClick={() => handleMediaType('camera')}><IconCamera/></Button>
            </ButtonGroup>
{/*             
            <Form.Label>Select Image(s)</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control 
                    type="file" 
                    className="shareInput bg-dark text-white"
                    accept='image/*'
                />
                <InputGroup.Text></InputGroup.Text>
            </InputGroup> */}
            </>
        );
    } else if (type === 'mp4') {
        return (
            <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Select Video(s)</Form.Label>
                <Form.Control 
                    type="file" 
                    multiple 
                    accept="video/*" // Accetta solo file video MP4
                />
            </Form.Group>
        );
    } else if (type === 'gps') {
        return <TestGeolocation/>;
    } else {
        return null;
    }
}