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
        <h1>IMG</h1>
      </> 
    );
  } else if (type === 'pst') {
    return (
        <h1>PST</h1>
    );
  } else if (type === 'upl') {
    return (
        <h1>UPL</h1>
    );
  } else if (type === 'cmr') {
    return (
        <h1>CMR</h1>
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