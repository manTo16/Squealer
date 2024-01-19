import axios from '@root/axiosConfig';
import { useContext, useEffect, useState } from 'react';
import { Badge, Button, Form, InputGroup, CloseButton, Collapse, ListGroup } from 'react-bootstrap';
import { apiUsersURL } from '../URLs';
import { UserContext } from '@utils/userData';

interface UserSelectorProps {
    placeholderText?: string;
    buttons: string[];
    setButtons: (newButtons: string[]) => void;
}

export default function UserSelector({placeholderText="Inserisci il nome dell'utente", buttons, setButtons} : UserSelectorProps) {

  const [inputText, setInputText] = useState("");
  //const [buttons, setButtons] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  const handleAddClick = () => {
    setButtons([...buttons, inputText]);
    setInputText("");
    setShowSuggestions(false);
  };

  const handleDeleteClick = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!showSuggestions && e.target.value !== "") setSuggestionsLoading(true)
    setShowSuggestions(e.target.value !== "");
  };

  const fetchSuggestions = async (username: string, resultsNumber: number = 5) => {
    const response = axios.get(apiUsersURL+`/search/byUsername/${resultsNumber}/${username}`).then(response => response.data)
    return response
  }

  useEffect(() => {
    const loadSuggestions = async () => {
        setSuggestions(await fetchSuggestions(inputText))
        setSuggestionsLoading(false)
    }
    loadSuggestions()
  }, [inputText])

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
          {suggestionsLoading ? 
          (
            <ListGroup.Item>loading</ListGroup.Item>
          ) :
          (
            suggestions.map((suggestion, index) => (
                <ListGroup.Item key={index} onClick={() => setInputText(suggestion)}>{suggestion}</ListGroup.Item>
            ))
          )}
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