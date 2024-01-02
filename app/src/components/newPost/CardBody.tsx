import React, { useState, ChangeEvent } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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

    // const [charCount, setCharCount] = useState(0);

    if (type === 'txt') {
        return (
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
        );
    } else if (type === 'img') {
        return (
            <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Select Image(s)</Form.Label>
                <Form.Control 
                    type="file" 
                    className="shareInput bg-dark text-white"
                    multiple 
                    accept='image/*'
                />
                {/* <InputGroup.Text></InputGroup.Text> */}
            </Form.Group>
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
        return null;
    } else {
        return null;
    }
}