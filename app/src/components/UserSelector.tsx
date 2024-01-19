import { useState } from 'react';
import { Badge, Button, Form, InputGroup, CloseButton, Collapse, ListGroup } from 'react-bootstrap';

interface UserSelectorProps {
    placeholderText?: string;
    suggestions?: string[];
}

export default function UserSelector({placeholderText="Inserisci il nome dell'utente", suggestions=["a", "b", "c"]} : UserSelectorProps) {
  const [inputText, setInputText] = useState("");
  const [buttons, setButtons] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddClick = () => {
    setButtons(prevButtons => [...prevButtons, inputText]);
    setInputText("");
    setShowSuggestions(false);
  };

  const handleDeleteClick = (index: number) => {
    setButtons(prevButtons => prevButtons.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setShowSuggestions(e.target.value !== "");
  };

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder={placeholderText}
          value={inputText}
          onChange={handleInputChange}
        />
        <Button variant="outline-secondary" onClick={handleAddClick}>
          Aggiungi
        </Button>
      </InputGroup>
      <Collapse in={showSuggestions}>
        <ListGroup>
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item key={index}>{suggestion}</ListGroup.Item>
          ))}
        </ListGroup>
      </Collapse>
      {buttons.map((buttonText, index) => (
        <span key={index} className='fs-3 me-3'>
            <Badge pill bg="secondary" className="mb-3 ">
            <span className='d-flex align-items-center'>{buttonText}
            <CloseButton aria-label="remove user"  variant="white" onClick={() => handleDeleteClick(index)} className='fs-6' />
            </span></Badge>
        </span>
        ))}
    </>
  );
}